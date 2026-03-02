import { ConceptDeclaration, ModelManager } from "@accordproject/concerto-core";
import path from "path";
import { GetTypeDefinitionsBody, GetTypeNamesBody, SearchRecordsBody, TypeNameInfo } from "../models/datawriteback";
import { ModelManagerUtil } from "../utils/modelManagerUtil";
import { IReq, IRes } from "../utils/types";
import { extractPairs } from "../utils/mapping";
import { mapWithSchema } from "../mapping/schema";
import { accountSchema } from "../mapping/account.schema";
import { entitySchema } from "../mapping/entity.schema";
import { randomUUID } from "crypto";
import { AccountValidationRequestBody, EntityValidationRequestBody } from "../models/jpmorgan";
import { validateAccount, validateEntity } from "./jpmorgan.verification.service";


enum DECORATOR_NAMES {
  TERM = 'Term',
  CRUD = 'Crud',
}

enum CRUD_ARGUMENTS {
  CREATEABLE = 'Createable',
  READABLE = 'Readable',
  UPDATEABLE = 'Updateable',
}

enum ErrorCode {
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
}

type ErrorResponse = {
  message: string;
  code: string;
}

/**
 * Checks if the given declaration is a readable concept by checking for a Crud decorator with "Readable".
 * @param declaration - The declaration to check.
 * @returns {boolean} True if the declaration is a readable concept, false otherwise.
 */
const isReadableConcept = (concept: ConceptDeclaration): boolean => {
  return (concept.getDecorator(DECORATOR_NAMES.CRUD)?.arguments[0] || '' as string).includes(CRUD_ARGUMENTS.READABLE);
};

/**
 * Generates an error response object with the provided message and code.
 *
 * @param {string} message - The error message.
 * @param {string} code - The error code.
 * @return {ErrorResponse} The generated error response object.
 */
const generateErrorResponse = (message: string, code: string): ErrorResponse => {
  return {
    message,
    code
  }
}

/**
 * Concerto model manager setup using CTO file.
 * Model manager allowes users to load in CTO files and use Concerto model features directly in code.
 */
const MODEL_MANAGER: ModelManager = ModelManagerUtil.createModelManagerFromCTO(path.join(__dirname, "../dataModel/model.cto"));
const CONCEPTS: ConceptDeclaration[] = MODEL_MANAGER.getConceptDeclarations();
const READABLE_CONCEPTS: ConceptDeclaration[] = CONCEPTS.filter(isReadableConcept);

/**
 * Retrieves the type names.
 * @param {IReq<GetTypeNamesBody>} req - the request object
 * @param {IRes} res - the response object
 * @return {IRes}
 */
export const getTypeNames = (req: IReq<GetTypeNamesBody>, res: IRes): IRes => {
  const typeNameInfos: TypeNameInfo[] = READABLE_CONCEPTS.map((concept: ConceptDeclaration) => {
    return {
      typeName: concept.getName(),
      label: (concept.getDecorator(DECORATOR_NAMES.TERM).getArguments()[0]) as unknown as string,
    }
  });

  return res.json({ typeNames: typeNameInfos as TypeNameInfo[]})
};

/**
 * Retrieves the type definitions for the given type names.
 * @param {IReq<GetTypeDefinitionsBody>} req - The request object.
 * @param {IRes} res - The response object.
 * @return {IRes}
 */
export const getTypeDefinitions = (req: IReq<GetTypeDefinitionsBody>, res: IRes): IRes => {
  const {
    body: {
      typeNames
    },
  } = req;
  if (!typeNames) {
    return res.status(400).json(generateErrorResponse(ErrorCode.BAD_REQUEST, 'Missing typeNames in request')).send();
  }

  try {
    return res.json({
      declarations: READABLE_CONCEPTS.map((concept: ConceptDeclaration) => concept.ast)
    })
  } catch (err) {
    console.log(`Encountered an error getting type definitions: ${err.message}`);
    return res.status(500).json(generateErrorResponse(ErrorCode.INTERNAL_ERROR, err)).send();
  }
};

/**
 * Searches records based on the provided query and pagination.
 * @param {IReq<SearchRecordsBody>} req - The request object containing query and pagination.
 * @param {IRes} res - The response object to send back.
 * @return {IRes}
 */
export const searchRecords = async (req: IReq<SearchRecordsBody>, res: IRes): Promise<IRes> => {
  const {
    body: {
      query
    },
  } = req;

  try {
    const keyValuePairs = extractPairs(query);
    const isAccountValidation = query.from === "Account";

    let body: AccountValidationRequestBody | EntityValidationRequestBody;
    let response, verified;
    if (isAccountValidation) {
      const account = mapWithSchema(keyValuePairs, accountSchema);
      const entity = mapWithSchema(keyValuePairs, entitySchema);

      body = {
        requestId: randomUUID(),
        profileName: "globalaccountvalidation",
        account,
        entity,
      }

      response = await validateAccount(body, res);
      verified = response.data[0]?.responses[0]?.codes?.verification?.message === "Open Valid"
        && response.data[0]?.responses[0]?.codes?.authentication?.message === "Ownership Match"
        || false;
    } else {
      const entity = mapWithSchema(keyValuePairs, entitySchema);

      body = {
        requestId: randomUUID(),
        entity,
      }
      response = await validateEntity(body, res);
      verified = response.data[0]?.responses[0]?.codes?.individualID?.message === "Pass"
        || false;
    }

    const validationResponse = { verified, message: "Verified" };

    return res.status(200).json(validationResponse);
  } catch (error) {
    console.log(`Encountered an error searching data: ${error.message}`);

    const validationResponse = { verified: false, message: error.message };
    return res.status(200).json(validationResponse);
  }
};
import { DeclarationUnion } from "@accordproject/concerto-types";
import { IQuery } from "./IQuery";

/**
 * Represents pagination parameters when searching for records using queries
 */
export type SearchRecordsPagination = {
  /**
   * The maximum number of items to retrieve in a single search request.
   */
  limit: number;
  /**
   * The number of items to skip before starting to return search results.
   */
  skip: number;
};


export type SearchRecordsBody = {
  /**
   * The query to execute as the search criteria
   */
  query: IQuery;
  
  /**
   * The query to execute as the search criteria
   */
  pagination: SearchRecordsPagination
};

export type SearchRecordsResponse = object;

export type GetTypeNamesBody = void;

export type GetTypeNamesResponse = {
  /**
   * A collection of type names whose converted schemas the client is trying to retrieve.
   */
    typeNames: TypeNameInfo[];
}

/**
 * The error information given when type fails to be retrieved or transformed
 */
export type GetTypeDefinitionsError = {
  typeName: string;
  code: GetTypeDefinitionsErrorCode;
  message: string;
};

/**
 *  An exhaustive set of reason codes for the failure
 */
export enum GetTypeDefinitionsErrorCode {
    SCHEMA_RETRIEVAL_FAILED,
    SCHEMA_TRANSFORMATION_FAILED,
    UNKNOWN
}

export type TypeNameInfo = {
  /**
   * Name of the type
   */
  typeName: string;

  /**
   * A display friendly name of the underlying type that can be used to render on UX canvases
   */
  label: string;

  /**
   * A help text describing the purpose/use of the type
   */
  description?: string;
};


export type GetTypeDefinitionsBody = {
  /**
   * A collection of type names whose converted schemas the client is trying to retrieve.
   */
  typeNames: TypeNameInfo[];
}

export type GetTypeDefinitionsResponse = {
  /**
   * The converted list of schemas present in the external system
   * See https://concerto.accordproject.org/docs/design/specification/model-classes
   */
  declarations: DeclarationUnion[];
  
  /**
   * A list of errors associated with fetching or transforming the schemas
   */
  errors?: GetTypeDefinitionsError[];
}
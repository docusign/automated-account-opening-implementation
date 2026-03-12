import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { expressjwt as jwt } from 'express-jwt';
import checkValidationErrors from '../middleware/checkValidationErrors';
import { getTypeDefinitions, getTypeNames, searchRecords } from '../services/dataio.service';
import { dataIOGetTypeDefinitionsRecordBody, dataIOGetTypeNamesRecordBody, dataIOSearchRecordsBody } from '../validationSchemas/dataio';

import Paths from '../constants/paths';

const dataIORouter = Router();

dataIORouter.post(
    Paths.DataIO.GetTypeNames.Post,
    jwt({
      secret: process.env.JWT_SECRET_KEY!,
      algorithms: ['HS256'],
    }),
    checkSchema(dataIOGetTypeNamesRecordBody, ['body']),
    checkValidationErrors,
    getTypeNames
);

dataIORouter.post(
    Paths.DataIO.GetTypeDefinitions.Post,
    jwt({
      secret: process.env.JWT_SECRET_KEY!,
      algorithms: ['HS256'],
    }),
    checkSchema(dataIOGetTypeDefinitionsRecordBody, ['body']),
    checkValidationErrors,
    getTypeDefinitions
);

dataIORouter.post(
    Paths.DataIO.SearchRecords.Post,
    jwt({
      secret: process.env.JWT_SECRET_KEY!,
      algorithms: ['HS256'],
    }),
    checkSchema(dataIOSearchRecordsBody, ['body']),
    checkValidationErrors,
    searchRecords
);

export default dataIORouter;
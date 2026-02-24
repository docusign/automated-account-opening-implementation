import { Router } from 'express';
import { checkSchema } from 'express-validator';
import Paths from '../constants/paths';
import checkValidationErrors from '../middleware/checkValidationErrors';
import { getTypeDefinitions, getTypeNames, searchRecords } from '../services/dataio.service';
import { dataIOGetTypeDefinitionsRecordBody, dataIOGetTypeNamesRecordBody, dataIOSearchRecordsBody } from '../validationSchemas/dataio';

const dataIORouter = Router();

dataIORouter.post(
    Paths.DataIO.GetTypeNames.Post,
    checkSchema(dataIOGetTypeNamesRecordBody, ['body']),
    checkValidationErrors,
    getTypeNames
);

dataIORouter.post(
    Paths.DataIO.GetTypeDefinitions.Post,
    checkSchema(dataIOGetTypeDefinitionsRecordBody, ['body']),
    checkValidationErrors,
    getTypeDefinitions
);

dataIORouter.post(
    Paths.DataIO.SearchRecords.Post,
    checkSchema(dataIOSearchRecordsBody, ['body']),
    checkValidationErrors,
    searchRecords
);

export default dataIORouter;
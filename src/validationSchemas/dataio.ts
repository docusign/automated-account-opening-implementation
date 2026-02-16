import { Schema } from 'express-validator';

export const dataIOSearchRecordsBody: Schema = {
  query: { isObject: true },
  pagination: { isObject: true },
};

export const dataIOGetTypeNamesRecordBody: Schema = {};

export const dataIOGetTypeDefinitionsRecordBody: Schema = {
  typeNames: { isArray: true }
}
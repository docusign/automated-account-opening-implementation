/**
 * Setup express server.
 */

import morgan from 'morgan';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';

import 'express-async-errors';
import { t as translate } from './i18n';

import BaseRouter from './controllers/api.controller';
import Paths from './constants/paths';

import HttpStatusCodes from './constants/http';
import path from 'path';
import { NodeEnvs } from './constants/env';
import { RouteError } from './utils/errors';
import { UnauthorizedError } from 'express-jwt';

const app = express();
const isDev = process.env.NODE_ENV === NodeEnvs.Dev;
const viewsPath = isDev ? path.join(__dirname, '../views') : path.join(__dirname, 'views');

app.set('views', viewsPath);
app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('./views'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// expose translator to views and request handlers via `res.locals.t`
app.use((_, res, next) => {
  (res as any).locals.t = translate;
  next();
});

// Show routes called in console during development
if (process.env.NODE_ENV === NodeEnvs.Dev) {
  app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === NodeEnvs.Production) {
  app.use(helmet());
}

// Add APIs, must be after middleware
app.use(Paths.Base, BaseRouter);

// Add error handler
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== NodeEnvs.Test) {
    console.error(err, true);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError || err instanceof UnauthorizedError) {
    status = err.status;
  }
  return res.status(status).json({ error: err.message });
});

export default app;

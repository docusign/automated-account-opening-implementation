import { Router } from "express";
import Paths from "../constants/paths";
import dataIORouter from "./dataio.controller";

const apiRouter = Router();

apiRouter.use(Paths.DataIO.Base, dataIORouter);

export default apiRouter;

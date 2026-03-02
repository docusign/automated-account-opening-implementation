import { Router } from 'express';

import Paths from '../constants/paths';
import { generateAuthToken } from '../services/jpmorgan.auth.service';

const authRouter = Router();

authRouter.post(Paths.JPMorgan.Token.Post, generateAuthToken);

export default authRouter;

import express, { Request, Response } from 'express';

import signInValidator from '../validators/signInValidator';
import { requestValidation } from '../middlewares/requestValidation';

const router = express.Router();

router.post(
  '/',
  signInValidator,
  requestValidation,
  (req: Request, res: Response) => {}
);

export { router as signInRoute };

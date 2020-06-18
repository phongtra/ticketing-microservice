import express, { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import signInValidator from '../validators/signInValidator';
import { RequestValidationError } from '../errors/RequestValidationErrors';

const router = express.Router();

router.post('/', signInValidator, (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    throw new RequestValidationError(error.array());
  }
  const { email, password } = req.body;
});

export { router as signInRoute };

import express, { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import signUpValidator from '../validators/signUpValidator';
import { RequestValidationError } from '../errors/RequestValidationErrors';
import { DatabaseConnectionError } from '../errors/DatabaseConnectionError';

const router = express.Router();

router.post('/', signUpValidator, (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    throw new RequestValidationError(error.array());
  }
  const { email, password } = req.body;
  console.log('Creating User');
  throw new DatabaseConnectionError();
  res.end();
});

export { router as signUpRoute };

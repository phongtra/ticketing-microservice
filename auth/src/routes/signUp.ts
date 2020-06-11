import express, { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import signUpValidator from '../validators/signUpValidator';

const router = express.Router();

router.post('/', signUpValidator, (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    throw new Error('Invalid email or password');
  }
  const { email, password } = req.body;
  console.log('Creating User');
  res.end();
});

export { router as signUpRoute };

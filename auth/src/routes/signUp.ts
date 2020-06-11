import express, { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import signUpValidator from '../validators/signUpValidator';

const router = express.Router();

router.post('/', signUpValidator, (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).send(error.array());
  }
  const { email, password } = req.body;
  console.log('Creating User');
  res.end();
});

export { router as signUpRoute };

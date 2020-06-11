import express, { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import signInValidator from '../validators/signUpValidator';

const router = express.Router();

router.post('/', signInValidator, (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).send(error.array());
  }
  const { email, password } = req.body;
});

export { router as signInRoute };

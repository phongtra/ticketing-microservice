import express, { Request, Response } from 'express';

import signInValidator from '../validators/signInValidator';

const router = express.Router();

interface SignInBodyRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

router.post('/', signInValidator, (req: SignInBodyRequest, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
  }
});

export { router as signInRoute };

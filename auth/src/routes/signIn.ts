import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import signInValidator from '../validators/signInValidator';
import { requestValidation, BadRequestError } from '@pt-ticket/common';
import { User } from '../models/User';
import { Password } from '../services/passwordHashingService';

const router = express.Router();

router.post(
  '/',
  signInValidator,
  requestValidation,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) throw new BadRequestError('Invalid Credential');
    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordMatch) throw new BadRequestError('Invalid credential');
    const userJWT = jwt.sign(
      { userId: existingUser.id, userEmail: existingUser.email },
      process.env.JWT_KEY!
    );

    req.session = { jwt: userJWT };
    res.send(existingUser);
  }
);

export { router as signInRoute };

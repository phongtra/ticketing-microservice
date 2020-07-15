import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import signUpValidator from '../validators/signUpValidator';
import { BadRequestError, requestValidation } from '@pt-ticket/common';

const router = express.Router();

router.post(
  '/',
  signUpValidator,
  requestValidation,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new BadRequestError('Email is already in used');

    const user = User.build({ email, password });
    await user.save();
    const userJWT = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!
    );

    req.session = { jwt: userJWT };
    res.status(201).send(user.toJSON());
  }
);

export { router as signUpRoute };

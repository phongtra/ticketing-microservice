import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { User } from '../models/User';
import signUpValidator from '../validators/signUpValidator';
import { RequestValidationError } from '../errors/RequestValidationErrors';
import { BadRequestError } from '../errors/BadRequestError';

const router = express.Router();

router.post('/', signUpValidator, async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    throw new RequestValidationError(error.array());
  }
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError('Email is already in used');
  }
  const user = User.build({ email, password });
  await user.save();
  console.log('Proceed to sending jwt');
  const userJWT = jwt.sign(
    { userId: user.id, userEmail: user.email },
    process.env.JWT_KEY!
  );

  console.log(userJWT);
  req.session = { jwt: userJWT };
  res.status(201).send(user.toJSON());
});

export { router as signUpRoute };

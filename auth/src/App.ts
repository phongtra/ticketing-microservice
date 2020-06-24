import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUserRouter } from './routes/currentUser';
import { signInRoute } from './routes/signIn';
import { signOutRoute } from './routes/signOut';
import { signUpRoute } from './routes/signUp';
import { errorHandler, NotFoundError } from '@pt-ticket/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
);

app.use('/api/users/currentuser', currentUserRouter);
app.use('/api/users/signin', signInRoute);
app.use('/api/users/signout', signOutRoute);
app.use('/api/users/signup', signUpRoute);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };

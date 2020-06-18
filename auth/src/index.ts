import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import { currentUserRouter } from './routes/currentUser';
import { signInRoute } from './routes/signIn';
import { signOutRoute } from './routes/signOut';
import { signUpRoute } from './routes/signUp';
import { errorHandler } from './middlewares/errorHandler';
import { NotFoundError } from './errors/NotFoundError';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true
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

const start = async () => {
  let retries = 5;
  while (retries > 0)
    try {
      await mongoose.connect('mongodb://auth-mongo-srv-cluster:27017/auth', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      });
      console.log('Connecting to mongodb');
      break;
    } catch (e) {
      retries--;
      console.error('Failed to connect, retries time is: ', retries);
    }
};

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
start();

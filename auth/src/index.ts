import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import { currentUserRouter } from './routes/currentUser';
import { signInRoute } from './routes/signIn';
import { signOutRoute } from './routes/signOut';
import { signUpRoute } from './routes/signUp';
import { errorHandler } from './middlewares/errorHandler';
import { NotFoundError } from './errors/NotFoundError';

const app = express();
app.use(json());

app.use('/api/users/currentuser', currentUserRouter);
app.use('/api/users/signin', signInRoute);
app.use('/api/users/signout', signOutRoute);
app.use('/api/users/signup', signUpRoute);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv-cluster:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('Connecting to mongodb');
  } catch (e) {
    console.error(e);
  }
};

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
start();

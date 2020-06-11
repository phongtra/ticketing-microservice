import express, { Request, Response } from 'express';
import { json } from 'body-parser';
import { currentUserRouter } from './routes/currentUser';
import { signInRoute } from './routes/signIn';
import { signOutRoute } from './routes/signOut';
import { signUpRoute } from './routes/signUp';

const app = express();
app.use(json());

app.use('/api/users/currentuser', currentUserRouter);
app.use('/api/users/signin', signInRoute);
app.use('/api/users/signout', signOutRoute);
app.use('/api/users/signup', signUpRoute);

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});

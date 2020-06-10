import express, { Request, Response } from 'express';
import { json } from 'body-parser';

const app = express();
app.use(json());

app.get('/api/users/currentuser', (_req: Request, res: Response) => {
  res.send('Hello world');
});

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});

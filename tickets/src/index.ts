import http from 'http';
import { app } from './App';
import { DbConnect } from './DbConnect';
import { natsWrapper } from './NatsConnect';
import { randomBytes } from 'crypto';

const server = http.createServer(app);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  await natsWrapper.connect(
    'ticketing',
    randomBytes(4).toString('hex'),
    'http://nats-srv-cluster:4222'
  );
  await DbConnect();

  server.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();

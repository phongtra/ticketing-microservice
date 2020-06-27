import http from 'http';
import { app } from './App';
import { DbConnect } from './DbConnect';

const server = http.createServer(app);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  DbConnect();
  server.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();

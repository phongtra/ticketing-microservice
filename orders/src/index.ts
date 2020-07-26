import http from 'http';
import { app } from './App';
import { DbConnect } from './DbConnect';
import { natsWrapper } from './NatsWrapper';
import { NatsConnect } from './NatsConnect';
import { TicketCreatedListener } from './events/listeners/TicketCreatedListener';
import { TicketUpdatedListener } from './events/listeners/TicketUpdatedListener';

const server = http.createServer(app);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  await NatsConnect();

  natsWrapper.stan.on('close', () => {
    console.log('NATS connection close on ticketing');
    process.exit();
  });
  process.on('SIGINT', () => natsWrapper.stan.close());
  process.on('SIGTERM', () => natsWrapper.stan.close());
  new TicketCreatedListener(natsWrapper.stan).listen();
  new TicketUpdatedListener(natsWrapper.stan).listen();
  console.log('Listening to events');
  await DbConnect();

  server.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();

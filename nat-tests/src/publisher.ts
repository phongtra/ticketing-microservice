import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/TicketCreatedPublisher';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
});

stan.on('connect', async () => {
  console.log('Publisher connected to nats');

  const data = {
    id: '123',
    title: 'connect',
    price: 20
  };
  try {
    await new TicketCreatedPublisher(stan).publish(data);
  } catch (e) {
    console.log(e);
  }
});

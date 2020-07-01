import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Listener connected to nats');
  const opts = stan.subscriptionOptions().setManualAckMode(true);
  const subsription = stan.subscribe(
    'ticket:created',
    'listenerQueueGroup',
    opts
  );
  subsription.on('message', (msg: Message) => {
    const data = msg.getData();
    if (typeof data === 'string') {
      console.log(
        `Received event number: ${msg.getSequence()}, with data: ${data}`
      );
    }
    msg.ack();
  });
});

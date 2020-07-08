import { natsWrapper } from './NatsWrapper';

import { randomBytes } from 'crypto';
export const NatsConnect = async () => {
  let retries = 5;
  while (retries > 0)
    try {
      await natsWrapper.connect(
        'ticketing',
        randomBytes(4).toString('hex'),
        'http://nats-srv-cluster:4222'
      );

      break;
    } catch (e) {
      retries--;
      console.error('Failed to connect, retries time is: ', retries);
      if (retries == 0) {
        throw new Error('Failed to connect to NATS');
      }
    }
};

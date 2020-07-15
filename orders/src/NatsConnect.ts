import { natsWrapper } from './NatsWrapper';

export const NatsConnect = async () => {
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  let retries = 5;
  while (retries > 0)
    try {
      await natsWrapper.connect(
        process.env.NATS_CLUSTER_ID,
        process.env.NATS_CLIENT_ID,
        process.env.NATS_URL
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

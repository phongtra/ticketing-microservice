import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  private _stan?: Stan;

  async connect(clusterId: string, clientId: string, url: string) {
    this._stan = nats.connect(clusterId, clientId, { url });

    this.stan.on('connect', () => {
      console.log('Connected to NATS');
    });
    this.stan.on('error', (err) => {
      throw err;
    });
  }
  get stan() {
    if (!this._stan) {
      throw new Error('Cannot access nats client before connecting');
    }
    return this._stan;
  }
}

export const natsWrapper = new NatsWrapper();

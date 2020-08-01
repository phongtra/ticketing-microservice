import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  private _stan?: Stan;

  connect(clusterId: string, clientId: string, url: string) {
    // docs call client stan (!?)
    const stan = nats.connect(clusterId, clientId, {
      url
    });
    this._stan = stan;

    return new Promise((res, rej) => {
      this.stan.on('connect', () => {
        console.log('Tickets: NATS Singleton Server Connected');
        return res();
      });

      // error
      this.stan.on('error', (err: any) => {
        rej(err);
      });
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

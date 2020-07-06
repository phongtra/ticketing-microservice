import { Stan } from 'node-nats-streaming';
import { Subjects } from './Subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  protected abstract subject: T['subject'];
  constructor(private client: Stan) {}
  async publish(data: T['data']) {
    this.client.publish(this.subject, JSON.stringify(data), (err) => {
      if (err) {
        throw err;
      }
      console.log(`${this.subject} event published`);
    });
  }
}

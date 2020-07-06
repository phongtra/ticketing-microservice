import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './Subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  protected abstract subject: T['subject'];
  protected abstract queueGroupName: string;
  protected abstract onMessage(data: T['data'], msg: Message): void;
  protected ackWait = 5 * 1000;
  constructor(private client: Stan) {}

  private subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );
    subscription.on('message', (msg: Message) => {
      console.log(`
          Message received: ${this.subject} / ${this.queueGroupName}
        `);
      const parseData = this.parseMessage(msg);
      this.onMessage(parseData, msg);
    });
  }

  private parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf-8'));
  }
}

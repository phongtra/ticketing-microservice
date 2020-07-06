import { Listener } from './Listener';
import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from './TicketCreatedEvent';
import { Subjects } from './Subjects';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  protected readonly subject = Subjects.TicketCreated;
  protected queueGroupName = 'paymentService';
  protected onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data);
    msg.ack();
  }
}

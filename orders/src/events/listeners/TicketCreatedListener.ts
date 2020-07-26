import { Listener, TicketCreatedEvent, Subjects } from '@pt-ticket/common';
import { Message } from 'node-nats-streaming';
import { QUEUE_GROUP_NAME } from '../../constants';
import { Ticket } from '../../models/Ticket';
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  protected readonly subject = Subjects.TicketCreated;

  protected queueGroupName = QUEUE_GROUP_NAME;
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('listened');

    const { id, title, price } = data;
    const ticket = Ticket.build({ id, title, price });
    await ticket.save();
    msg.ack();
  }
}

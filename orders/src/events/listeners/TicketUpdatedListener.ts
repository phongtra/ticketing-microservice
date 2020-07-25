import { Message } from 'node-nats-streaming';
import {
  Listener,
  TicketUpdatedEvent,
  Subjects,
  TicketCreatedEvent
} from '@pt-ticket/common';
import { QUEUE_GROUP_NAME } from '../../constants';
import { Ticket } from '../../models/Ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  protected readonly subject = Subjects.TicketUpdated;
  protected queueGroupName = QUEUE_GROUP_NAME;
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.id);
    if (!ticket) {
      throw new Error('Ticket is not found');
    }
    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();
    msg.ack();
  }
}

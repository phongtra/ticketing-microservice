import { Message } from 'node-nats-streaming';
import { Listener, TicketUpdatedEvent, Subjects } from '@pt-ticket/common';
import { Ticket } from '../../models/Ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  protected readonly subject = Subjects.TicketUpdated;
  protected queueGroupName = 'orderService';
  protected onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    Ticket.findById(data.id).then((ticket) => {
      if (!ticket) {
        throw new Error('Ticket is not found');
      }
      const { title, price } = data;
      ticket.set({ title, price });
      ticket.save().then(() => {
        console.log('ticket updated');
        msg.ack();
      });
    });
  }
}

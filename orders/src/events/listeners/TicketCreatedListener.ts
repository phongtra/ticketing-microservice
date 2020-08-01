// import { Listener, TicketCreatedEvent, Subjects } from '@pt-ticket/common';
// import { Message } from 'node-nats-streaming';
// import { QUEUE_GROUP_NAME } from '../../constants';
// import { Ticket } from '../../models/Ticket';
// export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
//   protected readonly subject = Subjects.TicketCreated;

import { Listener, TicketCreatedEvent, Subjects } from '@pt-ticket/common';
import { Message } from 'node-nats-streaming';
// import { QUEUE_GROUP_NAME } from '../../constants';
import { Ticket } from '../../models/Ticket';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  protected readonly subject = Subjects.TicketCreated;
  protected queueGroupName = 'orderService';
  protected onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({ id, title, price });
    ticket.save().then(() => {
      console.log('ticket saved');
      msg.ack();
    });
  }
}

import { Publisher } from './Publisher';
import { TicketCreatedEvent } from './TicketCreatedEvent';
import { Subjects } from './Subjects';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  protected readonly subject = Subjects.TicketCreated;
}

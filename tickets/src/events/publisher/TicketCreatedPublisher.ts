import { Publisher, Subjects, TicketCreatedEvent } from '@pt-ticket/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  protected readonly subject = Subjects.TicketCreated;
}

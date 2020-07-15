import { Publisher, Subjects, TicketUpdatedEvent } from '@pt-ticket/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  protected readonly subject = Subjects.TicketUpdated;
}

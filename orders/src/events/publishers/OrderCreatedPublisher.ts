import { Publisher, Subjects, OrderCreatedEvent } from '@pt-ticket/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  protected readonly subject = Subjects.OrderCreated;
}

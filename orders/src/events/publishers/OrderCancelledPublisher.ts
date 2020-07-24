import { Publisher, OrderCancelledEvent, Subjects } from '@pt-ticket/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  protected readonly subject = Subjects.OrderCancelled;
}

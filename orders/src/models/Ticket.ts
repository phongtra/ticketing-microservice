import mongoose, { Schema } from 'mongoose';
import { Order, OrderStatus } from './Order';

interface TicketAttrs {
  title: string;
  price: string;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: string;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true, default: 0 }
});

ticketSchema.set('toJSON', {
  transform(document, returedObject) {
    returedObject.id = returedObject._id;
    delete returedObject._id;
  }
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};
ticketSchema.methods.isReserved = async function () {
  //Run query to look at all order
  //Find an order where the ticket is the ticket we just created *and* the order status is *not* cancelled
  //If we find an order it means that the ticket *is* reserved
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  });
  return !!existingOrder;
};
export const Ticket = mongoose.model<TicketDoc, TicketModel>(
  'Ticket',
  ticketSchema
);

import mongoose, { Schema } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order, OrderStatus } from './Order';

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
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
ticketSchema.set('versionKey', 'version');
// ticketSchema.plugin(updateIfCurrentPlugin);
ticketSchema.pre('save', function (done) {
  // @ts-ignore
  this.$where = { version: this.get('version') - 1 };
  done();
});
ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({ _id: event.id, version: event.version - 1 });
};
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({ _id: attrs.id, title: attrs.title, price: attrs.price });
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

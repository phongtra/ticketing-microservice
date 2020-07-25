import mongoose, { Schema } from 'mongoose';
import { OrderStatus } from '@pt-ticket/common';
import { TicketDoc } from './Ticket';

export { OrderStatus };

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new Schema({
  userId: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created
  },
  expiresAt: { type: mongoose.Schema.Types.Date },
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }
});

orderSchema.set('toJSON', {
  transform(document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
  }
});

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

export const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

import mongoose, { Schema } from 'mongoose';

interface OrderAttrs {
  userId: string;
  status: string;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: string;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new Schema({
  userId: { type: String, required: true },
  status: { type: String, required: true },
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

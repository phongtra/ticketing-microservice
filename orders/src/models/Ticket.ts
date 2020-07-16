import mongoose, { Schema } from 'mongoose';

interface TicketAttrs {
  title: string;
  price: string;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: string;
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

export const Ticket = mongoose.model<TicketDoc, TicketModel>(
  'Ticket',
  ticketSchema
);

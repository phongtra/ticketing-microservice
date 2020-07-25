import request from 'supertest';
import { app } from '../../App';
import { signIn } from '../../test/signIn';
import { Ticket } from '../../models/Ticket';
// import { natsWrapper } from '../../NatsWrapper';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../models/Order';
import { natsWrapper } from '../../NatsWrapper';

it('has a route handler listening to /api/orders for post request', async () => {
  const res = await request(app).post('/api/orders').send({});
  expect(res.status).not.toEqual(404);
});
it('can only be accessed if user is signed in', async () => {
  const res = await request(app).post('/api/orders').send({}).expect(401);
  expect(res.body.errors[0].message).toEqual('Not Authorized');
});
it('returns a status other than 401 if user is signed in', async () => {
  const res = await request(app)
    .post('/api/orders')
    .set('Cookie', signIn())
    .send({});
  expect(res.status).not.toEqual(401);
});
it('returns an error if a ticket is not exist', async () => {
  const ticketId = mongoose.Types.ObjectId();
  await request(app)
    .post('/api/orders')
    .set('Cookie', signIn())
    .send({ ticketId })
    .expect(404);
});
it('returns an error if a ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });
  await ticket.save();
  const order = Order.build({
    ticket,
    userId: 'sjdkajldkjasld',
    status: OrderStatus.Created,
    expiresAt: new Date()
  });
  await order.save();
  await request(app)
    .post('/api/orders')
    .set('Cookie', signIn())
    .send({ ticketId: ticket.id })
    .expect(400);
});
it('reserves a ticket', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });
  await ticket.save();
  const res = await request(app)
    .post('/api/orders')
    .set('Cookie', signIn())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(res.body.ticket).toBeDefined();
});

it('emits an event after the order is created', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });
  await ticket.save();
  const res = await request(app)
    .post('/api/orders')
    .set('Cookie', signIn())
    .send({ ticketId: ticket.id })
    .expect(201);
  expect(natsWrapper.stan.publish).toHaveBeenCalled();
});

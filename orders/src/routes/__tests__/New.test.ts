import request from 'supertest';
import { app } from '../../App';
import { signIn } from '../../test/signIn';
import { Ticket } from '../../models/Ticket';
// import { natsWrapper } from '../../NatsWrapper';
import mongoose from 'mongoose';

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
it('returns an error if a ticket is already reserved', async () => {});
it('reserves a ticket', async () => {});

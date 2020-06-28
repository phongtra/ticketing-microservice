import request from 'supertest';
import { app } from '../../App';
import { signIn } from '../../test/signIn';
import mongoose from 'mongoose';

const createTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', signIn())
    .send({ title: 'hello', price: 4.5 })
    .expect(201);
};

it('returns all tickets if params is not provided', async () => {
  await createTicket();
  await createTicket();
  const res = await request(app).get('/api/tickets').send().expect(200);
  expect(res.body.length).toEqual(2);
});

it('returns a 404 if ticket is not found', async () => {
  const id = mongoose.Types.ObjectId().toHexString();
  return request(app).get(`/api/tickets/${id}`).send().expect(404);
});
it('returns the ticket if ticket is found', async () => {
  const res = await createTicket();
  const ticketRes = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send()
    .expect(200);
  expect(ticketRes.body.title).toEqual('hello');
});

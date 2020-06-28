import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../App';
import { signIn } from '../../test/signIn';

const createTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', signIn())
    .send({ title: 'hello', price: 4.5 })
    .expect(201);
};

it('returns a 404 if the provided id does not exist', async () => {
  const id = mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signIn())
    .send({ title: 'hello', price: 4.5 })
    .expect(404);
});

it('returns a 401 if the user is not logged in', async () => {
  const id = mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'hello', price: 4.5 })
    .expect(401);
});
it('returns a 401 if the user does not own the ticket', async () => {
  const res = await createTicket();
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', signIn())
    .send({ title: 'bye', price: 3.0 })
    .expect(401);
});
it('returns a 400 if the user provices invalid title or price', async () => {
  const cookie = signIn();
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'hello', price: 4.5 })
    .expect(201);
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 3.0 })
    .expect(400);
});
it('updates the ticket provided valid input', async () => {
  const cookie = signIn();
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'hello', price: 4.5 })
    .expect(201);
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'hi', price: 3.0 })
    .expect(200);
  const ticketRes = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send();
  expect(ticketRes.body.title).toEqual('hi');
  expect(ticketRes.body.price).toEqual(3.0);
});

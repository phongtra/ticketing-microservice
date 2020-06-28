import request from 'supertest';
import { app } from '../../App';
import { signIn } from '../../test/signIn';
import { Ticket } from '../../models/Ticket';

it('has a route handler listening to /api/tickets for post request', async () => {
  const res = await request(app).post('/api/tickets').send({});
  expect(res.status).not.toEqual(404);
});
it('can only be accessed if user is signed in', async () => {
  const res = await request(app).post('/api/tickets').send({}).expect(401);
  expect(res.body.errors[0].message).toEqual('Not Authorized');
});
it('returns a status other than 401 if user is signed in', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', signIn())
    .send({});
  expect(res.status).not.toEqual(401);
});
it('returns an error if invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signIn())
    .send({ title: '', price: 4.5 })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signIn())
    .send({ price: 4.5 })
    .expect(400);
});
it('returns an error if invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signIn())
    .send({ title: 'hello', price: -10 })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signIn())
    .send({ title: 'hello' })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  //add in a check to make sure the ticket was saved
  const beforeTickets = await Ticket.find({}).lean();
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signIn())
    .send({ title: 'hello', price: 5.0 })
    .expect(201);
  const afterTickets = await Ticket.find({}).lean();
  const createdTicket = await Ticket.findOne({ title: 'hello' });
  expect(afterTickets.length).toEqual(beforeTickets.length + 1);
  expect(createdTicket).toBeDefined();
});

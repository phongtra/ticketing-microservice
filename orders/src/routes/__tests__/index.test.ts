import request from 'supertest';
import { app } from '../../App';
import { signIn } from '../../test/signIn';
import { Ticket } from '../../models/Ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });
  await ticket.save();
  return ticket;
};

it('has a route handler listening to /api/orders for get request', async () => {
  const res = await request(app).get('/api/orders').send({});
  expect(res.status).not.toEqual(404);
});
it('can only be accessed if user is signed in', async () => {
  const res = await request(app).get('/api/orders').send({}).expect(401);
  expect(res.body.errors[0].message).toEqual('Not Authorized');
});
it('returns a status other than 401 if user is signed in', async () => {
  const res = await request(app)
    .get('/api/orders')
    .set('Cookie', signIn())
    .send({});
  expect(res.status).not.toEqual(401);
});
it('fetches orders for an particular user', async () => {
  //Create 3 tickets
  const ticket1 = await buildTicket();
  const ticket2 = await buildTicket();
  const ticket3 = await buildTicket();

  const user1 = signIn();
  const user2 = signIn();
  //Create one order as user #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket1.id })
    .expect(201);
  //Create two orders as user #2
  const { body: order1 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket2.id })
    .expect(201);
  const { body: order2 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket3.id })
    .expect(201);
  //Make request to orders for user #2
  const res = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .send({})
    .expect(200);
  //Make sure we only got orders for user #2
  expect(res.body.length).toEqual(2);
  expect(res.body[0].id).toEqual(order1.id);
  expect(res.body[1].id).toEqual(order2.id);
});

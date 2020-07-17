import request from 'supertest';
import { app } from '../../App';
import { signIn } from '../../test/signIn';
import { Ticket } from '../../models/Ticket';

it('returns an error if the orderId is invalid', async () => {
  const res = await request(app)
    .get('/api/orders/askdhasdasjahd')
    .set('Cookie', signIn())
    .send({});

  expect(res.status).not.toEqual(404);
});
it('can only be accessed if user is signed in', async () => {
  const res = await request(app).get('/api/orders').send({}).expect(401);
  expect(res.body.errors[0].message).toEqual('Not Authorized');
});

it('fetches the orders', async () => {
  //Create a ticket
  const ticket = Ticket.build({ title: 'concert', price: 20 });
  await ticket.save();
  const user1 = signIn();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket.id })
    .expect(201);
  const { body: fetchOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user1)
    .send({})
    .expect(200);

  expect(fetchOrder.id).toEqual(order.id);
});
it('returns an erro if one user try to fetch another users orders', async () => {
  //Create a ticket
  const ticket = Ticket.build({ title: 'concert', price: 20 });
  await ticket.save();
  const user1 = signIn();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket.id })
    .expect(201);
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', signIn())
    .send({})
    .expect(401);
});

import request from 'supertest';
import { app } from '../../App';
import { signIn } from '../../test/signIn';
import { Ticket } from '../../models/Ticket';
import { Order, OrderStatus } from '../../models/Order';

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

it('marks an order as cancelled', async () => {
  const ticket = Ticket.build({ title: 'concert', price: 20 });
  await ticket.save();
  const user1 = signIn();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket.id })
    .expect(201);
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user1)
    .send({})
    .expect(204);
  const cancelledOrder = await Order.findById(order.id);
  expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled);
});

it.todo('emits an event for cancelled order');

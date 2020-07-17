import { Router, Response, Request } from 'express';
import {
  requireAuth,
  requestValidation,
  NotFoundError,
  BadRequestError,
  OrderStatus
} from '@pt-ticket/common';
import orderValidator from '../validators/orderValidator';
import { Ticket } from '../models/Ticket';
import { Order } from '../models/Order';

const EXPIRATION_WINDOW_SECOND = 15 * 60;

const router = Router();

router.get('/', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.currentUser!.id }).populate(
    'ticket'
  );
  res.send(orders);
});

router.delete('/:orderId', async (req: Request, res: Response) => {
  res.send({});
});

router.post(
  '/',
  requireAuth,
  orderValidator,
  requestValidation,
  async (req: Request, res: Response) => {
    //Find the ticket the user is trying to order in the database
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    //Make sure that the ticket has not already been reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket has already been reserved');
    }

    //Calculate the expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECOND);

    //Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket
    });
    await order.save();

    //Publish an event saying that an order is created
    res.status(201).send(order);
  }
);

router.get('/:orderId', async (req: Request, res: Response) => {
  res.send({});
});

export { router as orderRoute };

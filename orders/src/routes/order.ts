import { Router, Response, Request } from 'express';
import mongoose from 'mongoose';
import {
  requireAuth,
  requestValidation,
  NotFoundError,
  BadRequestError,
  OrderStatus,
  NotAuthorizedError
} from '@pt-ticket/common';
import orderValidator from '../validators/orderValidator';
import { Ticket } from '../models/Ticket';
import { Order } from '../models/Order';
import { param } from 'express-validator';

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

router.get(
  '/:orderId',
  requireAuth,
  [
    param('orderId')
      .notEmpty()
      .withMessage('orderId must be provided')
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('orderId must be valid')
  ],
  requestValidation,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    res.send(order);
  }
);

export { router as orderRoute };

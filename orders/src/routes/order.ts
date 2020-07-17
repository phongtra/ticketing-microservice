import { Router, Response, Request } from 'express';
import {
  requireAuth,
  requestValidation,
  NotFoundError,
  BadRequestError
} from '@pt-ticket/common';
import orderValidator from '../validators/orderValidator';
import { Ticket } from '../models/Ticket';
import { Order } from '../models/Order';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  res.send({});
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

    //Build the order and save it to the database

    //Publish an event saying that an order is created
  }
);

router.get('/:orderId', async (req: Request, res: Response) => {
  res.send({});
});

export { router as orderRoute };

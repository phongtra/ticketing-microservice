import express, { Request, Response } from 'express';
import {
  requireAuth,
  requestValidation,
  NotFoundError,
  NotAuthorizedError
} from '@pt-ticket/common';
import ticketValidator from '../../validators/ticketValidator';
import { Ticket } from '../models/Ticket';
import { TicketCreatedPublisher } from '../events/publisher/TicketCreatedPublisher';
import { natsWrapper } from '../NatsWrapper';
import { TicketUpdatedPublisher } from '../events/publisher/TicketUpdatedPublisher';

const router = express.Router();

router.post(
  '/',
  requireAuth,
  ticketValidator,
  requestValidation,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id
    });
    await ticket.save();
    await new TicketCreatedPublisher(natsWrapper.stan).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId
    });
    res.status(201).send(ticket);
  }
);

router.get('/', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});
  return res.send(tickets);
});

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const ticket = await Ticket.findById(id);
  if (!ticket) {
    throw new NotFoundError();
  }
  res.send(ticket);
});

router.put(
  '/:id',
  requireAuth,
  ticketValidator,
  requestValidation,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new NotFoundError();
    }
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    const { title, price } = req.body;
    ticket.set({
      title,
      price
    });
    await ticket.save();
    await new TicketUpdatedPublisher(natsWrapper.stan).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId
    });
    res.send(ticket);
  }
);

export { router as ticketRoute };

import express, { Request, Response } from 'express';
import {
  requireAuth,
  requestValidation,
  NotFoundError
} from '@pt-ticket/common';
import createTicketValidator from '../../validators/createTicketValidator';
import { Ticket } from '../models/Ticket';

const router = express.Router();

router.post(
  '/',
  requireAuth,
  createTicketValidator,
  requestValidation,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id
    });
    await ticket.save();
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

export { router as createTicketRouter };

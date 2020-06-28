import express, { Request, Response } from 'express';
import { requireAuth, requestValidation } from '@pt-ticket/common';
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

export { router as createTicketRouter };

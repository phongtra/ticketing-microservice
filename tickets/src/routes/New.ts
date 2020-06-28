import express, { Request, Response } from 'express';
import { requireAuth, requestValidation } from '@pt-ticket/common';
import createTicketValidator from '../../validators/createTicketValidator';

const router = express.Router();

router.post(
  '/',
  requireAuth,
  createTicketValidator,
  requestValidation,
  (req: Request, res: Response) => {
    res.sendStatus(201);
  }
);

export { router as createTicketRouter };

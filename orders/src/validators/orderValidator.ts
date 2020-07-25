import { body } from 'express-validator';
import mongoose from 'mongoose';

export default [
  body('ticketId')
    .notEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('TicketId must be provided')
];

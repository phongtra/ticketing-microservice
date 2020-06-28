import { body } from 'express-validator';

export default [
  body('title').notEmpty().withMessage('Title is required'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than zero')
];

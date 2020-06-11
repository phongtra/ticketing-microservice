import { body } from 'express-validator';

export default [
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be between 4 and 20 characters')
    .matches('[A-Z]')
    .withMessage('Password must have at least 1 uppercase character')
    .matches('[a-z]')
    .withMessage('Password must have at least 1 lowercase character')
    .matches('[0-9]')
    .withMessage('Password must contain a number')
    .matches('[^a-zA-Z0-9]')
    .withMessage('Password must contain at least 1 non alphanumeric character')
];

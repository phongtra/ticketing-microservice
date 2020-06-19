import { ValidationError } from 'express-validator';
import { CustomError } from './CustomError';

export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super('request validation error');
    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  serializeErrors() {
    const formattedErrors = this.errors.map((error) => {
      return { message: error.msg, field: error.param };
    });
    return formattedErrors;
  }
}

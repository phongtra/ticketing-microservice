import { CustomError } from './CustomError';

export class NotFoundError extends CustomError {
  statusCode = 404;
  constructor() {
    super('Not found error');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
  serializeErrors() {
    return [{ message: 'Not Found' }];
  }
}

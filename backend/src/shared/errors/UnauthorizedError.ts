import { StatusCodes } from 'http-status-codes';
import RequestError from './RequestError';

class UnauthorizedError extends RequestError {
  constructor(public message: string) {
    super(StatusCodes.UNAUTHORIZED, message);
    this.message = message;
  }
}

export { UnauthorizedError };

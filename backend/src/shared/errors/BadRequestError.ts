import { StatusCodes } from 'http-status-codes';
import RequestError from './RequestError';

class BadRequestError extends RequestError {
  constructor(public message: string) {
    super(StatusCodes.BAD_REQUEST, message);
    this.message = message;
  }
}

export { BadRequestError };

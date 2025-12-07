import { StatusCodes } from 'http-status-codes';
import RequestError from './RequestError';

class ConflictError extends RequestError {
  constructor(public message: string) {
    super(StatusCodes.CONFLICT, message);
    this.message = message;
  }
}

export { ConflictError };

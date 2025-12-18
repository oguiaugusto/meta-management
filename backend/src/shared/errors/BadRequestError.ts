import { StatusCodes } from 'http-status-codes';
import RequestError from './RequestError';

class BadRequestError extends RequestError {
  constructor(public error: string | Record<string, string>) {
    super(StatusCodes.BAD_REQUEST, error);
  }
}

export { BadRequestError };

import { StatusCodes } from 'http-status-codes';
import { ErrorType } from '../types/misc';
import RequestError from './RequestError';

class BadRequestError extends RequestError {
  constructor(
    public error: string | Record<string, string>,
    public type: ErrorType,
  ) {
    super(StatusCodes.BAD_REQUEST, error, type);
  }
}

export { BadRequestError };

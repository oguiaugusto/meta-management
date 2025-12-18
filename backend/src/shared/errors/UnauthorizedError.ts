import { StatusCodes } from 'http-status-codes';
import { ErrorType } from '../types/misc';
import RequestError from './RequestError';

class UnauthorizedError extends RequestError {
  constructor(
    public error: string | Record<string, string>,
    public type: ErrorType,
  ) {
    super(StatusCodes.UNAUTHORIZED, error, type);
  }
}

export { UnauthorizedError };

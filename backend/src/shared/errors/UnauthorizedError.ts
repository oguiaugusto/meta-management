import { StatusCodes } from 'http-status-codes';
import RequestError from './RequestError';

class UnauthorizedError extends RequestError {
  constructor(public error: string | Record<string, string>) {
    super(StatusCodes.UNAUTHORIZED, error);
  }
}

export { UnauthorizedError };

import { StatusCodes } from 'http-status-codes';
import RequestError from './RequestError';

class ConflictError extends RequestError {
  constructor(public error: string | Record<string, string>) {
    super(StatusCodes.CONFLICT, error);
  }
}

export { ConflictError };

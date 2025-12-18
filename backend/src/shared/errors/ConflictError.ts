import { StatusCodes } from 'http-status-codes';
import { ErrorType } from '../types/misc';
import RequestError from './RequestError';

class ConflictError extends RequestError {
  constructor(
    public error: string | Record<string, string>,
    public type: ErrorType,
  ) {
    super(StatusCodes.CONFLICT, error, type);
  }
}

export { ConflictError };

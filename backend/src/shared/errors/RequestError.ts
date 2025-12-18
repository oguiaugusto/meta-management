import { ErrorType } from '../types/misc';

class RequestError {
  constructor(
    public status: number,
    public message: string | Record<string, string>,
    public type: ErrorType,
  ) {
    this.status = status;
    this.message = message;
  }
}

export default RequestError;

import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import RequestError from '../errors/RequestError';

type ErrorType = RequestError | ZodError;

class ErrorMiddleware {
  public static handle = (err: ErrorType, _req: Request, res: Response, _next: NextFunction) => {
    let status = StatusCodes.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal Server Error';

    if (err.message) {
      message = err.message;
    }

    if (err instanceof ZodError) {
      message = err.issues.map((issue) => (
        issue.path.length === 0 ? issue.message : `${issue.path.join('.')}: ${issue.message}`
      ));

      status = StatusCodes.BAD_REQUEST;
    }

    if (err instanceof RequestError) {
      status = err.status;
      message = err.message;
    }

    console.log(err);

    return res.status(status).json({ message });
  };
}

export default ErrorMiddleware;
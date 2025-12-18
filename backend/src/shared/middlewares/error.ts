import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import z, { ZodError } from 'zod';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import RequestError from '../errors/RequestError';
import { zodErrorMap } from '../utils/zodErrorMap';

type ErrorType = RequestError | ZodError;

class ErrorMiddleware {
  public static handle = (err: ErrorType, _req: Request, res: Response, _next: NextFunction) => {
    let status = StatusCodes.INTERNAL_SERVER_ERROR;

    let error: string | null = 'Internal Server Error';
    let fields: Record<string, string> | undefined;

    if (err.message) {
      error = err.message;
    }

    if (err instanceof ZodError) {
      fields = zodErrorMap(err);
      console.log(fields);

      error = null;
      status = StatusCodes.BAD_REQUEST;
    }

    if (err instanceof RequestError) {
      status = err.status;
      error = err.message;
    }

    if (err instanceof UnauthorizedError) {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      });
    }

    // console.log(err);

    return res.status(status).json({ error, fields });
  };
}

export default ErrorMiddleware;
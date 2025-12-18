import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { zodErrorMap } from '../utils/zodErrorMap';
import RequestError from '../errors/RequestError';

type ErrorType = Error | RequestError | ZodError;

class ErrorMiddleware {
  public static handle = (err: ErrorType, _req: Request, res: Response, _next: NextFunction) => {
    let status = StatusCodes.INTERNAL_SERVER_ERROR;

    let error: string | undefined = 'Internal Server Error';
    let fields: Record<string, string> | undefined;

    if (err instanceof ZodError) {
      fields = zodErrorMap(err);
      error = undefined;

      status = StatusCodes.BAD_REQUEST;
    }

    if (err instanceof RequestError) {
      status = err.status;

      if (typeof err.error === 'string') {
        error = err.error;
        fields = undefined;
      } else {
        fields = err.error;
        error = undefined;
      }
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
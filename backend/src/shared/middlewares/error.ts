import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { zodErrorMap } from '../utils/zodErrorMap';
import RequestError from '../errors/RequestError';
import { ErrorType } from '../types/misc';

type ErrType = Error | RequestError | ZodError;

class ErrorMiddleware {
  public static handle = (err: ErrType, _req: Request, res: Response, _next: NextFunction) => {
    let status = StatusCodes.INTERNAL_SERVER_ERROR;

    let type: ErrorType = 'unknown';
    let message: string | undefined = 'Unexpected server error';
    let fields: Record<string, string> | undefined;

    if (err instanceof ZodError) {
      type = 'field';
      message = undefined;
      fields = zodErrorMap(err);

      status = StatusCodes.BAD_REQUEST;
    }

    if (err instanceof RequestError) {
      status = err.status;

      type = err.type;

      if (err.type === 'field' && typeof err.message !== 'string') {
        message = undefined;
        fields = err.message;
      } else if (typeof err.message === 'string') {
        message = err.message;
        fields = undefined;
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

    return res.status(status).json({ type, message, fields });
  };
}

export default ErrorMiddleware;
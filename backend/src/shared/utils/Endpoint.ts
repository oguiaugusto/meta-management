import rescue from 'express-rescue';
import { Request, Response, Router } from 'express';

type Method = 'get' | 'post' | 'put' | 'delete';
type Handler = (req: Request, res: Response) => Promise<void>;

class Endpoints {
  public static router = Router();

  public static route(
    handler: Handler,
    method: Method,
    endpoint: string,
    skipAuth?: boolean
  ) {
    this.router[method](
      '/api' + endpoint,
      // skipAuth ? (_req, _res, next) => next() : rescue(AuthMiddleware.handle),
      rescue(handler),
    );
  }
}

export default Endpoints;
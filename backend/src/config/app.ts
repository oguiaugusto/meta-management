import { StatusCodes } from 'http-status-codes';
import express from 'express';
import cors from 'cors';
import ErrorMiddleware from '../shared/middlewares/error';
import 'dotenv/config';

class App {
  public static app = express();

  public static config(): void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(accessControl);
    this.app.use(cors());
    this.app.use(express.json({ limit: '6mb' }));

    this.routes();
    this.app.use(ErrorMiddleware.handle);
  }

  private static routes(): void {
    this.app.get('/', (_, res) => {
      res.status(StatusCodes.OK).json({ message: 'Online! :)' })
    });

    // this.app.use(Endpoints.router);
  }

  public static async start(PORT: string | number) {
    const envVars = [
      'DB_HOST',
      'DB_PORT',
      'DB_USER',
      'DB_PASS',
      'DB_NAME',
      'EMAIL_USER',
      'EMAIL_PASS',
      'AUTH_KEY',
    ];

    const invalidEnvironmentVariables = envVars.some((str) => {
      const envVar = process.env[str];
      return !envVar || envVar.length === 0;
    });

    if (invalidEnvironmentVariables) {
      throw new Error('Variáveis de ambiente não configuradas própriamente');
    }

    this.app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}

export default App;

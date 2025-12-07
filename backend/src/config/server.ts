import 'dotenv/config';
import App from './app';
import AuthController from '../modules/Auth/AuthController';
import AuthRepository from '../modules/Auth/AuthRepository';

const PORT = process.env.PORT || 3001;

function main() {
  const authController = new AuthController(new AuthRepository());

  const app = new App({ authController });

  app.start(PORT);
}

main();

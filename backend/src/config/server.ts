import App from './app';
import 'dotenv/config';

const PORT = process.env.PORT || 3001;

App.start(PORT);
App.config();

require('dotenv').config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import source from './ormconfig';
import { routes } from './routes';

source.initialize().then(() => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));

  routes(app);

  app.listen(8080, () => {
    console.log('listening on port 8080');
  });
});

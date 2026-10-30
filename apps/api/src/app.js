import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { authRouter } from './routes/auth.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: false }));
  app.use(express.json({ limit: '16kb' }));
  app.use('/api/auth', authRouter);

  app.get('/health', (_request, response) => {
    response.status(200).json({ status: 'ok' });
  });

  return app;
}


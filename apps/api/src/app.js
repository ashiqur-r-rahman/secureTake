import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { authRouter } from './routes/auth.js';
import { sessionRouter } from './routes/sessions.js';
import { checkinRouter } from './routes/checkins.js';
import { reportRouter } from './routes/reports.js';
import { errorHandler } from './app/errorHandler.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: false }));
  app.use(express.json({ limit: '16kb' }));
  app.use('/api/auth', authRouter);
  app.use('/api/sessions', sessionRouter);
  app.use('/api/checkins', checkinRouter);
  app.use('/api/reports', reportRouter);
  app.use(errorHandler);

  app.get('/health', (_request, response) => {
    response.status(200).json({ status: 'ok' });
  });

  return app;
}


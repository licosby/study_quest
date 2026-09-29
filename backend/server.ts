import express, { Express } from 'express';
import dotenv from 'dotenv';
import chapterRoutes from './routes/chapters.js';
import triviaRoutes from './routes/trivia.js';
import audioRoutes from './routes/audio.js';
import mnemonicRoutes from './routes/mnemonics.js';
import analyticsRoutes from './routes/analytics.js';

dotenv.config();

export function createBackendApp(): Express {
  const app = express();

  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // API Route mounting
  app.use('/api/chapters', chapterRoutes);
  app.use('/api/trivia', triviaRoutes);
  app.use('/api/audio', audioRoutes);
  app.use('/api/mnemonics', mnemonicRoutes);
  app.use('/api/analytics', analyticsRoutes);

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Study Quest API Engine',
      timestamp: new Date().toISOString(),
      models: {
        reasoning: 'gemini-3.8-flash',
        tts: 'gemini-3.8-flash-lite-tts'
      }
    });
  });

  return app;
}

import cors from 'cors';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/$/, '');
}

export const corsOptions = cors({
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    const normalized = normalizeOrigin(origin);
    if (config.frontendOrigins.includes(normalized)) {
      callback(null, true);
      return;
    }

    logger.warn(`CORS blocked origin: ${normalized} (allowed: ${config.frontendOrigins.join(', ')})`);
    callback(null, false);
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

import express from 'express';
import cors from 'cors';
import { requestLogger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import servicesRoutes from './routes/servicesRoutes.js';
import metricsRoutes from './routes/metricsRoutes.js';
import incidentsRoutes from './routes/incidentsRoutes.js';

export const createApp = () => {
  const app = express();

  // Standard middleware
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  });

  // REST API routes
  app.use('/api/services', servicesRoutes);
  app.use('/api/metrics', metricsRoutes);
  app.use('/api/incidents', incidentsRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: `Route ${req.method} ${req.originalUrl} not found.`
    });
  });

  // Centralized error handler
  app.use(errorHandler);

  return app;
};

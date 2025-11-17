import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { configureMiddleware } from './config/middleware';
import routes from './routes';
import { registerRealtime } from './sockets/realtime';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Configure middleware (cors, json parser, etc.)
configureMiddleware(app);

// API Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();

    registerRealtime(server);

    server.listen(PORT, () => {
      logger.info('Server.started', {
        port: PORT,
        env: process.env.NODE_ENV || 'development',
      });
    });
  } catch (error) {
    logger.error('Server.startFailure', error);
    process.exit(1);
  }
};

startServer();

export default app;

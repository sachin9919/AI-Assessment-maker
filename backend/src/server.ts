import { createServer } from 'http';
import app from './app';
import config from './config';
import { connectDB } from './config/db';
import { getRedisClient } from './config/redis';
import { initAssessmentWorker } from './workers/assessmentWorker';
import { initSocket } from './config/socket';
import { Worker } from 'bullmq';

const bootstrap = async (): Promise<void> => {
  // Connect to MongoDB
  await connectDB();

  let redis = null as ReturnType<typeof getRedisClient> | null;
  let assessmentWorker: Worker | null = null;

  // Try to initialize Redis + worker. If env is missing, keep API booted so
  // auth and non-queue screens can still run locally.
  try {
    redis = getRedisClient();
    if (redis.status === 'wait' || redis.status === 'close' || redis.status === 'reconnecting') {
      try {
        await redis.connect();
      } catch {
        // Ignore if it's already connecting
      }
    }
    assessmentWorker = initAssessmentWorker();
  } catch (err) {
    console.warn('⚠️ Redis/worker not initialized. Queue features are disabled.');
    console.warn(`   Reason: ${(err as Error).message}`);
  }

  // Create HTTP server and initialize Socket.io
  const httpServer = createServer(app);
  initSocket(httpServer);

  // Start HTTP server
  const server = httpServer.listen(config.port, () => {
    console.log(`✅ Backend running on http://localhost:${config.port}`);
    console.log(`   Environment : ${config.nodeEnv}`);
    console.log(`   Health check: http://localhost:${config.port}/api/health`);
    if (!assessmentWorker) {
      console.log('   Queue worker : disabled (missing Redis config)');
    }
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log('\nShutting down gracefully…');
    server.close(async () => {
      if (assessmentWorker) {
        await assessmentWorker.close();
      }
      if (redis) {
        await redis.quit();
      }
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

bootstrap().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});

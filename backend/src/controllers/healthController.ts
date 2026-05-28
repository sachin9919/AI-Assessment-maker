import { Request, Response } from 'express';
import { getMongoStatus } from '../config/db';
import { getRedisClient } from '../config/redis';

/**
 * GET /api/health
 * Returns the status of the API, MongoDB, and Upstash Redis.
 */
export const healthCheck = async (_req: Request, res: Response): Promise<void> => {
  // ── MongoDB ──────────────────────────────────────────────────────────────
  const mongo = getMongoStatus();

  // ── Upstash Redis ────────────────────────────────────────────────────────
  let redisStatus: 'connected' | 'disconnected' = 'disconnected';
  let redisPing: string | null = null;

  try {
    const client = getRedisClient();
    // lazyConnect: explicitly connect if not already open
    if (client.status !== 'ready') {
      await client.connect();
    }
    redisPing = await client.ping();           // returns "PONG"
    redisStatus = redisPing === 'PONG' ? 'connected' : 'disconnected';
  } catch (err) {
    redisPing = (err as Error).message;
  }

  // ── Response ─────────────────────────────────────────────────────────────
  const allHealthy = mongo.status === 'connected' && redisStatus === 'connected';

  res.status(allHealthy ? 200 : 503).json({
    success: allHealthy,
    api: {
      status: 'connected',
      environment: process.env.NODE_ENV ?? 'development',
      timestamp: new Date().toISOString(),
    },
    mongodb: {
      status: mongo.status,
      readyState: mongo.readyState,
    },
    redis: {
      status: redisStatus,
      ping: redisPing,
    },
  });
};

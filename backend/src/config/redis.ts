import Redis from 'ioredis';

let redisClient: Redis | null = null;

/**
 * Returns a singleton ioredis client configured for Upstash Redis.
 *
 * Upstash requires TLS on port 6380.  ioredis resolves hostnames to both
 * IPv4 and IPv6 by default; setting `family: 0` (auto) avoids IPv6
 * resolution failures that occur in some environments.
 *
 * Required env var: UPSTASH_REDIS_URL
 *   Format: rediss://:PASSWORD@HOST:PORT
 */
export const getRedisClient = (): Redis => {
  if (redisClient) return redisClient;

  const url = process.env.UPSTASH_REDIS_URL;
  if (!url) {
    throw new Error('UPSTASH_REDIS_URL is not defined in environment variables');
  }

  redisClient = new Redis(url, {
    // Upstash uses TLS (rediss:// scheme). ioredis honours the scheme
    // automatically, but we also enforce TLS options explicitly:
    tls: {},
    // family: 0 → let the OS choose between IPv4/IPv6 (avoids ENOTFOUND
    // on IPv6-only or dual-stack environments)
    family: 0,
    // Fail fast so health checks don't hang
    connectTimeout: 5000,
    // BullMQ requires maxRetriesPerRequest to be null
    maxRetriesPerRequest: null,
    // Prevent ioredis from spamming reconnect logs in dev
    lazyConnect: true,
  });

  redisClient.on('connect', () => console.log('Upstash Redis connected'));
  redisClient.on('error', (err) =>
    console.error('Upstash Redis error:', err.message)
  );

  return redisClient;
};

export default getRedisClient;

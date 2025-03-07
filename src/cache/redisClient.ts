import { Redis } from 'ioredis'; 
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null, 
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redis.on('error', (err) => console.error('❌ Redis Error:', err));
redis.on('connect', () => console.log('✅ Connected to Redis'));

export default redis;

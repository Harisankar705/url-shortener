import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || "url-shortener-redis",
        port: Number(process.env.REDIS_PORT) || 6379, 
        reconnectStrategy: (retries) => {
            console.log(`🔄 Redis reconnect attempt: ${retries}`);
            return Math.min(retries * 100, 3000); 
        },
    },
});

// Error handling
redisClient.on('error', (err) => console.error('❌ Redis Error:', err));
redisClient.on('connect', () => console.log('✅ Connected to Redis'));
redisClient.on('reconnecting', () => console.log('🔄 Reconnecting to Redis...'));

// Connect to Redis
(async () => {
    try {
        await redisClient.connect();
        console.log('✅ Redis client connection established successfully');
    } catch (err) {
        console.error('❌ Redis connection failed:', err);
    }
})();

export default redisClient;

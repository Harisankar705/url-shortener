var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redisClient.connect();
        console.log('✅ Redis client connection established successfully');
    }
    catch (err) {
        console.error('❌ Redis connection failed:', err);
    }
}))();
export default redisClient;

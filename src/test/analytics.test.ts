import { NextFunction, Request, Response } from 'express';
import app from '../index.js';
import request from 'supertest';
import mongoose from 'mongoose';
import redis from "../cache/redisClient.js"; 
import redisClient from "../cache/redisClient.js"; 

// Increase Jest timeout to avoid long-running test failures
jest.setTimeout(150000);

// Mock authentication middleware to bypass real authentication
jest.mock('../middleware/auth', () => ({
    verifyToken: (req: Request, res: Response, next: NextFunction) => {
        req.user = { id: 'testUserId', email: 'test@example.com' }; 
        next();
    }
}));
beforeAll(async () => {
    await redisClient.flushall(); // Clears Redis data before tests
  });
  
describe('URL Shortening', () => {
    let token = 'mocked-token';

    it('should shorten a URL', async () => {
        const res = await request(app)
            .post('/api/urls/shorten')
            .set('Authorization', `Bearer ${token}`) 
            .send({ longUrl: 'https://example.com', topic: 'acquisition' });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('shortUrl');
    });

    it('should redirect to the original URL', async () => {
        // Step 1: First, create a short URL dynamically
        const longUrl = 'https://example.com';
        const shortenRes = await request(app)
            .post('/api/urls/shorten')
            .set('Authorization', `Bearer ${token}`)
            .send({ longUrl, topic: 'acquisition' });

        expect(shortenRes.status).toBe(201);
        expect(shortenRes.body).toHaveProperty('shortUrl');

        const alias = shortenRes.body.shortUrl; // Get dynamically generated alias

        // Step 2: Now test redirection using the alias
        const res = await request(app).get(`/api/urls/shorten/${alias}`);

        expect(res.status).toBe(302);
        expect(res.header.location).toBe(longUrl); // Use the original URL dynamically
    });

    it('should get analytics for a specific URL', async () => {
        // Step 1: Create a short URL first
        const longUrl = 'https://example.com';
        const shortenRes = await request(app)
            .post('/api/urls/shorten')
            .set('Authorization', `Bearer ${token}`)
            .send({ longUrl, topic: 'acquisition' });

        expect(shortenRes.status).toBe(201);
        expect(shortenRes.body).toHaveProperty('shortUrl');

        const alias = shortenRes.body.shortUrl;
        const res = await request(app).get(`/api/urls/analytics/${alias}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('totalClicks');
        expect(res.body).toHaveProperty('uniqueUsers');
    });
});

describe('Analytics', () => {
    it('should get topic-based analytics', async () => {
        const topic = 'acquisition';
        const res = await request(app).get(`/api/analytics/topic/${topic}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('totalClicks');
        expect(res.body).toHaveProperty('uniqueUsers');
    });

    it('should get overall analytics', async () => {
        const res = await request(app).get('/api/analytics/overall');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('totalUrls');
        expect(res.body).toHaveProperty('totalClicks');
    });
});
afterAll(async () => {
    await mongoose.connection.close();
    await redis.quit(); // Ensure Redis connection is closed
  });
  

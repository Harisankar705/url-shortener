var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import app from '../index.js';
import request from 'supertest';
import mongoose from 'mongoose';
import redis from "../cache/redisClient.js";
import redisClient from "../cache/redisClient.js";
jest.setTimeout(150000);
jest.mock('../middleware/auth', () => ({
    verifyToken: (req, res, next) => {
        req.user = { id: 'testUserId', email: 'test@example.com' };
        next();
    }
}));
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.flushall();
}));
describe('URL Shortening', () => {
    let token = 'mocked-token';
    it('should shorten a URL', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request(app)
            .post('/api/urls/shorten')
            .set('Authorization', `Bearer ${token}`)
            .send({ longUrl: 'https://example.com', topic: 'acquisition' });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('shortUrl');
    }));
    it('should redirect to the original URL', () => __awaiter(void 0, void 0, void 0, function* () {
        const longUrl = 'https://example.com';
        const shortenRes = yield request(app)
            .post('/api/urls/shorten')
            .set('Authorization', `Bearer ${token}`)
            .send({ longUrl, topic: 'acquisition' });
        expect(shortenRes.status).toBe(201);
        expect(shortenRes.body).toHaveProperty('shortUrl');
        const alias = shortenRes.body.shortUrl;
        const res = yield request(app).get(`/api/urls/shorten/${alias}`);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(longUrl);
    }));
    it('should get analytics for a specific URL', () => __awaiter(void 0, void 0, void 0, function* () {
        const longUrl = 'https://example.com';
        const shortenRes = yield request(app)
            .post('/api/urls/shorten')
            .set('Authorization', `Bearer ${token}`)
            .send({ longUrl, topic: 'acquisition' });
        expect(shortenRes.status).toBe(201);
        expect(shortenRes.body).toHaveProperty('shortUrl');
        const alias = shortenRes.body.shortUrl;
        const res = yield request(app).get(`/api/urls/analytics/${alias}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('totalClicks');
        expect(res.body).toHaveProperty('uniqueUsers');
    }));
});
describe('Analytics', () => {
    it('should get topic-based analytics', () => __awaiter(void 0, void 0, void 0, function* () {
        const topic = 'acquisition';
        const res = yield request(app).get(`/api/analytics/topic/${topic}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('totalClicks');
        expect(res.body).toHaveProperty('uniqueUsers');
    }));
    it('should get overall analytics', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request(app).get('/api/analytics/overall');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('totalUrls');
        expect(res.body).toHaveProperty('totalClicks');
    }));
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose.connection.close();
    yield redis.quit();
}));

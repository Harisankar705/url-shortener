import authMiddleware from '../middleware/auth.js'
import { Router } from "express";
import { rateLimiterMiddleware } from "../middleware/rateLimitter.js";
import { cached, createURL, getAnalytics, redirectShortUrl } from "../controller/urlController.js";

export const urlRoutes=Router()
urlRoutes.post('/shorten',authMiddleware,rateLimiterMiddleware,createURL)
urlRoutes.get('/shorten/:alias',authMiddleware, redirectShortUrl);
urlRoutes.get('/analytics/:alias',authMiddleware,getAnalytics);
urlRoutes.get('/:alias',authMiddleware,cached);


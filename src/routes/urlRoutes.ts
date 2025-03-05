import { Router } from "express";
import { rateLimiterMiddleware } from "../middleware/rateLimitter";
import { cached, createURL, getAnalytics, redirectShortUrl } from "../controller/urlController";

export const urlRoutes=Router()
urlRoutes.post('/shorten',rateLimiterMiddleware,createURL)
urlRoutes.get('/shorten/:alias', redirectShortUrl);
urlRoutes.get('/analytics/:alias',getAnalytics);
urlRoutes.get('/:alias',cached);

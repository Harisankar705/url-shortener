import express from 'express';
import { getOverallAnalytics, getTopicAnalytics } from '../controller/analyticsController.js';
export const analyticsRoutes = express.Router();
analyticsRoutes.get('/topic/:topic', getTopicAnalytics);
analyticsRoutes.get('/overall', getOverallAnalytics);

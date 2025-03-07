import express from 'express'
import { getOverallAnalytics, getTopicAnalytics } from '../controller/analyticsController.js'
import authMiddleware from 'src/middleware/auth.js'

export const analyticsRoutes = express.Router()
analyticsRoutes.get('/topic/:topic',authMiddleware,getTopicAnalytics)
analyticsRoutes.get('/overall',authMiddleware, getOverallAnalytics)


import { Request, Response } from 'express';
import UrlModel from "../models/Url.js";
import redisClient from "../cache/redisClient.js"; 
export const getTopicAnalytics = async (req: Request, res: Response) => {
  const { topic } = req.params;
  try {
    const urls = await UrlModel.find({ topic });
    if (!urls.length) {
       res.status(404).json({ message: 'No URLs found for this topic' });
       return
    }
    const totalClicks = urls.reduce((acc, url) => acc + (url.clicks || 0), 0);
    const uniqueUsers = new Set(urls.flatMap((url) => url.uniqueUsers || [])); 
     res.json({ topic, totalClicks, uniqueUsers: uniqueUsers.size, urls });
     return
  } catch (err) {
    console.error('Error fetching topic analytics:', err);
     res.status(500).json({ message: 'Server error' });
     return
  }
};
export const getOverallAnalytics = async (req: Request, res: Response) => {
  const cacheKey = 'overallAnalytics';
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
       res.json(JSON.parse(cachedData));
       return
    }
    const urls = await UrlModel.find({});
    const totalUrls = urls.length;
    const totalClicks = urls.reduce((acc, url) => acc + (url.clicks || 0), 0);
    const responseData = { totalUrls, totalClicks };
    await redisClient.set(cacheKey, JSON.stringify(responseData), 'EX', 3600);
     res.json(responseData);
     return
  } catch (err) {
    console.error('Error fetching overall analytics:', err);
     res.status(500).json({ message: 'Server error' });
     return
  }
};

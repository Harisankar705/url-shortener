import { Request, Response } from "express";
import { STATUS_CODES } from "../utils/statusCode.js";
import UrlModel from "../models/Url.js";
import { nanoid } from "nanoid"; 
import axios from "axios";
import AnalyticsModel from '../models/Analytics.js';
import useragent from 'useragent';
import redis from "../cache/redisClient.js";

export const createURL=async(req:Request,res:Response)=>{
    const {longUrl,customAlias,topic}=req.body
    console.log("Request Body:", req.body); 

    if(!longUrl)
    {
        res.status(STATUS_CODES.BAD_REQUEST).json({message:"Long url is required"})
        return
    }
    try {
        let shortUrl:string
        if(customAlias)
        {
            const existingAlias=await UrlModel.findOne({customAlias})
            if(existingAlias)
            {
                res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message:"Custom alias is already taken!"})
                return
            }
            shortUrl=customAlias
        }
        else
        {
            shortUrl=nanoid(6)
        }
        const newUrl=new UrlModel({
            longUrl,
            shortUrl,
            customAlias,
            topic,  
            createdAt:new Date()
        })
        await newUrl.save()
         res.status(STATUS_CODES.CREATED).json({
            message:"Short url created successfully!",
            shortUrl,
            longUrl
        })
        return
    } catch (error) {
        console.error("Error creating short URL",error)
         res.status(500).json({message:"Server error"})
         return
    }
}
export const redirectShortUrl = async (req: Request, res: Response) => {
  const { alias } = req.params;
  console.log(`🟢 Incoming request for alias: ${alias}`); 
  const ip = req.ip || req.headers['x-forwarded-for'] || 'Unknown';
  const userAgentString = req.headers['user-agent'] || 'Unknown';

  try {
      const shortUrl = await UrlModel.findOne({ shortUrl: alias });
      console.log("|SHORTURL",shortUrl)

      if (!shortUrl) {
           res.status(404).json({ message: 'Short URL not found' });
           return
      }

      await UrlModel.updateOne({ shortUrl: alias }, { $inc: { clicks: 1 } });

      const agent = useragent.parse(userAgentString);
      const osType = agent.os.toString();
      const deviceType = agent.device.toString();

      let location = {};
      try {
          const geoResponse = await axios.get(`https://ipinfo.io/${ip}/json`);
          location = geoResponse.data;
      } catch (geoError) {
          console.error('Error fetching geolocation:', geoError);
      }

      await AnalyticsModel.create({
          shortUrl: alias,
          ip,
          userAgent: userAgentString,
          osType,
          deviceType,
          location,
      });

      res.redirect(shortUrl.longUrl);
  } catch (error) {
      console.error('Error redirecting:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};
    export const getAnalytics=async(req:Request,res:Response)=>{
    const { alias } = req.params;
  
    try {
      const analytics = await AnalyticsModel.aggregate([
        { $match: { shortUrl: alias } },
        {
          $group: {
            _id: null,
            totalClicks: { $sum: 1 },
            uniqueUsers: { $addToSet: '$ip' },
            clicksByDate: {
              $push: {
                date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                count: { $sum: 1 },
              },
            },
            osBreakdown: { $push: '$osType' },
            deviceBreakdown: { $push: '$deviceType' },
          },
        },
        {
          $project: {
            _id: 0,
            totalClicks: 1,
            uniqueUsers: { $size: '$uniqueUsers' },
            clicksByDate: 1,
            osBreakdown: 1,
            deviceBreakdown: 1,
          },
        },
      ]);
  
      if (!analytics.length) {
         res.status(404).json({ message: 'No analytics data found' });
         return
      }
  
      res.json(analytics[0]);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
    export const cached=async  (req: Request, res: Response) => {
    const { alias } = req.params;
  
    try {
      const cachedUrl = await redis.get(`shortUrl:${alias}`);
      if (cachedUrl) {
         res.redirect(cachedUrl);
         return
      }
  
      const shortUrl = await UrlModel.findOne({ shortUrl: alias });
      if (!shortUrl) {
         res.status(404).json({ message: 'Short URL not found' });
         return
      }
      await redis.set(`shortUrl:${alias}`, shortUrl.longUrl, 'EX', 3600);
  
      res.redirect(shortUrl.longUrl);
    } catch (error) {
      console.error('Error redirecting:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
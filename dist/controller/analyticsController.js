var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import UrlModel from "../models/Url.js";
import redisClient from "../cache/redisClient.js";
export const getTopicAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { topic } = req.params;
    try {
        const urls = yield UrlModel.find({ topic });
        if (!urls.length) {
            res.status(404).json({ message: 'No URLs found for this topic' });
            return;
        }
        const totalClicks = urls.reduce((acc, url) => acc + (url.clicks || 0), 0);
        const uniqueUsers = new Set(urls.flatMap((url) => url.uniqueUsers || []));
        res.json({ topic, totalClicks, uniqueUsers: uniqueUsers.size, urls });
        return;
    }
    catch (err) {
        console.error('Error fetching topic analytics:', err);
        res.status(500).json({ message: 'Server error' });
        return;
    }
});
export const getOverallAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cacheKey = 'overallAnalytics';
    try {
        const cachedData = yield redisClient.get(cacheKey);
        if (cachedData) {
            res.json(JSON.parse(cachedData));
            return;
        }
        const urls = yield UrlModel.find({});
        const totalUrls = urls.length;
        const totalClicks = urls.reduce((acc, url) => acc + (url.clicks || 0), 0);
        const responseData = { totalUrls, totalClicks };
        yield redisClient.set(cacheKey, JSON.stringify(responseData), 'EX', 3600);
        res.json(responseData);
        return;
    }
    catch (err) {
        console.error('Error fetching overall analytics:', err);
        res.status(500).json({ message: 'Server error' });
        return;
    }
});

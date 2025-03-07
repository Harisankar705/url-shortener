import mongoose, { Schema } from 'mongoose';
import { IAnalytics } from '../interfaces.js';
const AnalyticsSchema = new Schema<IAnalytics>({
    shortUrl: { type: String, required: true },
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
    deviceType: { type: String, required: true },
    osType: { type: String, required: true },
    location: { type: Object },
    timestamp: { type: Date, default: Date.now },
  });
const AnalyticsModel= mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
export default AnalyticsModel

import mongoose, { Schema, Document } from 'mongoose';
import { IAnalytics } from '../interfaces';
const AnalyticsSchema = new Schema<IAnalytics>({
    shortUrl: { type: String, required: true },
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
    deviceType: { type: String, required: true },
    osType: { type: String, required: true },
    location: { type: Object },
    timestamp: { type: Date, default: Date.now },
  });
export default mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);

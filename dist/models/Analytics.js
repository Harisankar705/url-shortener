import mongoose, { Schema } from 'mongoose';
const AnalyticsSchema = new Schema({
    shortUrl: { type: String, required: true },
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
    deviceType: { type: String, required: true },
    osType: { type: String, required: true },
    location: { type: Object },
    timestamp: { type: Date, default: Date.now },
});
export default mongoose.model('Analytics', AnalyticsSchema);

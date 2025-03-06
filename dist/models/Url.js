import mongoose, { Schema } from "mongoose";
const urlSchema = new Schema({
    longUrl: { type: String, required: true },
    shortUrl: { type: String },
    clicks: { type: Number, default: 0 },
    customAlias: { type: String },
    topic: { type: String },
    createdAt: { type: Date }
});
const UrlModel = mongoose.model('Url', urlSchema);
export default UrlModel;

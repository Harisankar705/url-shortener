import mongoose, { Schema } from "mongoose";
export interface IUrl extends Document{
    longUrl:string,
    shortUrl:string,
    customAlias?:string,
    topic?:string,
    clicks?:string
    createdAt:Date
}
const urlSchema=new Schema<IUrl>({
    longUrl:{type:String,required:true},
    shortUrl:{type:String},
    clicks: { type: Number, default: 0 }, 
    customAlias:{type:String},
    topic:{type:String},
    createdAt:{type:Date}

})
const UrlModel=mongoose.model<IUrl>('Url',urlSchema)
export default UrlModel

import { Document, Types } from "mongoose";

export interface IUser
{
    _id?:string|Types.ObjectId,
    googleId?:string,
    name?:string|null,
    email?:string
}
export interface IError{
    statusCode?:number,
    message:string,
    details?:string
}
export interface IDecodedUser{
    id:string,
    email:string
    role?:string
    iat?:number,
    exp?:number
}
export interface ILocation {
    city?: string;
    region?: string;
    country?: string;
    loc?: string; 
    org?: string; 
    timezone?: string;
}

export interface IAnalytics extends Document {
    shortUrl: string;
    ip: string;
    userAgent: string;
    deviceType: string;
    osType: string;
    location?: ILocation;
    timestamp: Date;
  }
  
type DoneCallback=(errr:any,user?:Express.User|IUser|null)=>void
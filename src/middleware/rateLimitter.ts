import { NextFunction, Request, Response } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { STATUS_CODES } from "../utils/statusCode.js";
const rateLimiter=new RateLimiterMemory({
    points:5,
    duration:60
})
export const rateLimiterMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    rateLimiter.consume(req.ip as string)
    .then(()=>{
        next()
    })
    .catch(()=>{
        res.status(STATUS_CODES.TOO_MANY_REQUESTS).json({message:"Too many requests"})
    })
}
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken'
import {Request,Response,NextFunction} from 'express'
import {IUser } from '../interfaces.js'
import { STATUS_CODES } from '../utils/statusCode.js'
const authMiddleware=(req:Request,res:Response,next:NextFunction):void=>{
const authHeader=req.headers.authorization
if(authHeader)
{
    const token=authHeader.split(' ')[1]
    const jwtSecret=process.env.JWT_SECRET
    if(!jwtSecret)
    {
        console.error("JWT_SECRET not defined")
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
        return
    }
    jwt.verify(token,jwtSecret,(error:VerifyErrors|null,decodedUser:JwtPayload|string|undefined)=>{
        if(error)
        {   
            return res.status(STATUS_CODES.FORBIDDEN).json({message:"Forbidden:Invalid token"})
        }
        req.user=decodedUser as IUser
        next()
    })
}
else
{
     res.status(STATUS_CODES.UNAUTHORIZED).json({message:"Unauthorized:No token provided"})
     return
}
}
export default authMiddleware
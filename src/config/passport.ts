import UserModel from "../models/User.js"
import {GoogleCallbackParameters, Strategy as GoogleStrategy,Profile} from 'passport-google-oauth20'
import passport, { DoneCallback } from 'passport'; 
import { IUser } from "../interfaces.js";
import { Request } from "express";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL:'/auth/google/callback',
    passReqToCallback:true,
}, async (req: Request, accessToken: string, refreshToken: string, params: GoogleCallbackParameters, profile: Profile, done: (error:any,user?:any)=>void) => {
    try {
        let user = await UserModel.findOne({ googleId: profile.id }).lean<IUser>()
        if (!user) {
            user = await UserModel.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails?.[0].value
            })
        }
        return done(null, user)
    } catch (error) {
        return done(error, null)
    }
}
))
passport.serializeUser((user:IUser,done:DoneCallback)=>{
    done(null,user._id?.toString())
})
passport.deserializeUser(async(id:string,done:DoneCallback)=>{
    try {
        const user=await UserModel.findById(id)
        done(null,user)
    } catch (error) {
        done(error,undefined)
    }
})
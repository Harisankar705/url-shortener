import passport from 'passport'
import express from 'express'
import session from 'express-session'
import dotenv from 'dotenv'
import { authRoutes } from './routes/authRoutes'
import { urlRoutes } from './routes/urlRoutes'
dotenv.config()
    require('./config/passport')
const app=express()
app.use(express.json())
app.use(session({secret:process.env.SESSION_SECRET as string,resave:false,saveUninitialized:true}))
app.use(passport.initialize())
app.use(passport.session())
app.use(authRoutes)
app.use(urlRoutes)
const PORT=process.env.PORT||4444
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
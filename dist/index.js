import passport from 'passport';
import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import { authRoutes } from './routes/authRoutes.js';
import { urlRoutes } from './routes/urlRoutes.js';
import './config/passport.js';
import { dbConnection } from './config/dbConnection.js';
import { analyticsRoutes } from './routes/analyticsRoutes.js';
import swaggerSetup from './swaggerConfig.js';
dbConnection();
dotenv.config();
const app = express();
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
swaggerSetup(app);
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/analytics', analyticsRoutes);
const PORT = process.env.PORT || 4444;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
export default app;

import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
export const authRoutes = express.Router();
authRoutes.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
authRoutes.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json(token);
});

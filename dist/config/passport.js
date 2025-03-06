var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import UserModel from "../models/User.js";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    passReqToCallback: true,
}, (req, accessToken, refreshToken, params, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let user = yield UserModel.findOne({ googleId: profile.id }).lean();
        if (!user) {
            user = yield UserModel.create({
                googleId: profile.id,
                name: profile.displayName,
                email: (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value
            });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error, null);
    }
})));
passport.serializeUser((user, done) => {
    var _a;
    done(null, (_a = user._id) === null || _a === void 0 ? void 0 : _a.toString());
});
passport.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserModel.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error, undefined);
    }
}));

import jwt from 'jsonwebtoken';
import { STATUS_CODES } from '../utils/statusCode.js';
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("JWT_SECRET not defined");
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
            return;
        }
        jwt.verify(token, jwtSecret, (error, decodedUser) => {
            if (error) {
                return res.status(STATUS_CODES.FORBIDDEN).json({ message: "Forbidden:Invalid token" });
            }
            req.user = decodedUser;
            next();
        });
    }
    else {
        res.status(STATUS_CODES.UNAUTHORIZED).json({ message: "Unauthorized:No token provided" });
        return;
    }
};
export default authMiddleware;

import { verifyToken } from '../utils/jwt.js';

export const authenticateUser = (req, res, next) => {
    const {token} = req.cookies;

    if (!token) return res.status(401).json({ message: 'Unauthorized!' });

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

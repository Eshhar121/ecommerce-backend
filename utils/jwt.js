import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const DEFAULT_EXPIRES_IN = '1h';

export const generateToken = (payload, expiresIn = DEFAULT_EXPIRES_IN) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

export const decodeToken = (token) => {
    return jwt.decode(token);
};

import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../server.js';
import User from '../../models/User.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { generateToken } from '../../utils/jwt.js';

jest.mock('../../models/User.js', () => {
    const users = new Map();

    return {
        __esModule: true,
        default: {
            findById: jest.fn((id) => {
                const user = Array.from(users.values()).find((u) => u._id === id);
                return Promise.resolve(user || null);
            }),
            create: jest.fn((userData) => {
                const newUser = {
                    ...userData,
                    _id: 'mocked-user-id',
                    isVerified: false,
                    password: userData.password,
                    comparePassword: jest.fn((input) => Promise.resolve(input === userData.password)),
                    save: jest.fn().mockImplementation(function () {
                        users.set(this.email, this);
                        return Promise.resolve(this);
                    }),
                };
                users.set(userData.email, newUser);
                return Promise.resolve(newUser);
            }),
            findOne: jest.fn((query) => {
                if (query.email) return Promise.resolve(users.get(query.email) || null);

                if (query.resetPasswordToken) {
                    const user = Array.from(users.values()).find(u =>
                        u.resetPasswordToken === query.resetPasswordToken &&
                        u.resetPasswordExpires > Date.now()
                    );
                    return Promise.resolve(user || null);
                }

                return Promise.resolve(null);
            }),
        },
    }
});

jest.mock('../../utils/mail.js', () => ({
    sendVerificationEmail: jest.fn(() => Promise.resolve()),
    sendEmail: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../config/stripe.js', () => ({
    default: { customers: { create: jest.fn() } },
}));

let server;

describe('Auth Flow Integration', () => {
    const testUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'StrongPass123!',
    };

    beforeAll(async () => {
        process.env.JWT_SECRET = 'test-secret';
        process.env.EMAIL_USER = 'test@example.com';
        process.env.CLIENT_URL = 'http://localhost:3000';
        server = app.listen(0);
    });

    afterAll(async () => {
        await mongoose.connection.close();
        server.close();
    });

    beforeEach(() => jest.clearAllMocks());

    let verificationToken;

    test('should register a new user and send verification email', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send(testUser);

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toMatch(/verify your email/i);

        const userInDb = await User.findOne({ email: testUser.email });
        expect(userInDb).toBeTruthy();
        expect(userInDb.isVerified).toBe(false);

        verificationToken = generateToken({ _id: userInDb._id });
    });

    test('should verify email', async () => {
        const res = await request(app)
            .get(`/api/auth/verify-email/${verificationToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/verified/i);

        const updatedUser = await User.findOne({ email: testUser.email });
        expect(updatedUser.isVerified).toBe(true);
    });

    let cookie;

    test('should login successfully', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password,
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.user).toHaveProperty('email');
        expect(res.headers['set-cookie'][0]).toMatch(/token/);

        cookie = res.headers['set-cookie'];
    });

    let resetToken;

    test('should send forgot password email', async () => {
        const res = await request(app)
            .post('/api/auth/forgot-password')
            .send({ email: testUser.email });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/reset email sent/i);

        const user = await User.findOne({ email: testUser.email });
        expect(user.resetPasswordToken).toBeDefined();
        expect(user.resetPasswordExpires).toBeDefined();

        resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
        await user.save();
    });

    test('should reset the password', async () => {
        const res = await request(app)
            .post(`/api/auth/reset-password/${resetToken}`)
            .send({ password: 'NewPassword!123' });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/reset successful/i);

        const user = await User.findOne({ email: testUser.email });
        expect(user.resetPasswordToken).toBeUndefined();
        expect(user.resetPasswordExpires).toBeUndefined();
        expect(await bcrypt.compare('NewPassword!123', user.password)).toBe(true);
    });
});
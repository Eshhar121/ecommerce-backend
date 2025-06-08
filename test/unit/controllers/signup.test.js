import { jest } from '@jest/globals';

jest.mock('../../../models/User.js', () => {
    return {
        __esModule: true,
        default: {
            findOne: jest.fn(),
            create: jest.fn(),
        },
    };
});

jest.mock('bcryptjs', () => ({
    hash: jest.fn(),
}));

jest.mock('../../../utils/mail.js', () => ({
    sendVerificationEmail: jest.fn(),
}));

import { signup } from '../../../controllers/authController.js';
import User from '../../../models/User.js';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '../../../utils/mail.js';
import { mockUser } from '../../setup/mockData.js';

describe('Auth Controller - signup', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                name: mockUser.name,
                email: mockUser.email,
                password: 'plaintext123',
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.clearAllMocks();
    });

    it('should register a new user', async () => {
        User.findOne.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue(mockUser.password); // simulate hashed password
        User.create.mockResolvedValue(mockUser);
        sendVerificationEmail.mockResolvedValue();

        await signup(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ email: mockUser.email });
        expect(bcrypt.hash).toHaveBeenCalledWith('plaintext123', 12);
        expect(User.create).toHaveBeenCalledWith({
            name: mockUser.name,
            email: mockUser.email,
            password: mockUser.password,
            isVerified: false,
        });
        expect(sendVerificationEmail).toHaveBeenCalledWith(mockUser, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'User registered successfully. Please verify your email.',
            user: {
                id: mockUser._id,
                name: mockUser.name,
                email: mockUser.email,
            },
        });
    });

    it('should not allow duplicate users', async () => {
        User.findOne.mockResolvedValue(mockUser);

        await signup(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });
});

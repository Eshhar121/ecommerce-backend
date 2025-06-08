import { verifyEmail } from '../../../controllers/authController.js';
import User from '../../../models/User.js';
import { verifyToken } from '../../../utils/jwt.js';

jest.mock('../../../models/User.js');
jest.mock('../../../utils/jwt.js');

describe('Auth Controller - verifyEmail', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        token: 'valid-token',
      },
      cookies: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should verify user email successfully', async () => {
    const mockUser = {
      _id: '123',
      isVerified: false,
      save: jest.fn(),
    };
  
    verifyToken.mockReturnValue({ _id: '123' });
    User.findById.mockResolvedValue(mockUser);
  
    await verifyEmail(req, res);
  
    expect(mockUser.isVerified).toBe(true);
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email verified successfully' });
  });

  it('should return 404 if user not found', async () => {
    verifyToken.mockReturnValue({ _id: '123' });
    User.findById.mockResolvedValue(null);

    await verifyEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should return 400 if token is invalid or expired', async () => {
    verifyToken.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await verifyEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
  });
});

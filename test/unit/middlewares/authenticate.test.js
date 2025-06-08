import { jest } from '@jest/globals';

// Mock jwt.js
jest.mock('../../../utils/jwt.js', () => ({
  verifyToken: jest.fn(),
}));

import { verifyToken } from '../../../utils/jwt.js';
import { authenticateUser } from '../../../middlewares/authenticateUsers.js';

describe('authenticateUser middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { cookies: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks(); // Clear mocks
  });

  test('should return 401 if token is missing', () => {
    authenticateUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized!' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should call next and attach user if token is valid', () => {
    const mockUser = { _id: 'user123', role: 'user' };
    req.cookies.token = 'valid-token';

    verifyToken.mockReturnValue(mockUser);
    authenticateUser(req, res, next);

    expect(verifyToken).toHaveBeenCalledWith('valid-token');
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('should return 400 if token verification fails', () => {
    req.cookies.token = 'invalid-token';

    verifyToken.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authenticateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });
});

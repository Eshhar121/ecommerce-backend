import { jest } from '@jest/globals';
import { authorizeRoles } from '../../../middlewares/authorizeRoles.js'; describe

('authorizeRoles middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { user: { role: 'user' } }; // Important: mock user with role
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    test('should call next if role is authorized', () => {
        const middleware = authorizeRoles('user', 'admin');
        middleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    test('should return 403 if role is not authorized', () => {
        const middleware = authorizeRoles('admin'); // only admin allowed
        middleware(req, res, next); // but req.user.role is 'user'

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Access denied: insufficient role' });
        expect(next).not.toHaveBeenCalled();
    });
});

import express from 'express';
import { signup, login, verifyEmail, forgotPassword, resetPassword, logout, getCurrentUser } from '../controllers/authController.js';
import { authenticateUser } from '../middlewares/authenticateUsers.js';

const router = express.Router();

router.post('/logout', logout);
router.get('/me', authenticateUser, getCurrentUser);
router.post('/signup', signup);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;

import express from 'express';
import {
    getProfile,
    updateProfile,
    getEarnings,
    getSalesAnalytics,
    getOrders,
} from '../controllers/publisherController.js';
import { authenticateUser } from '../middlewares/authenticateUsers.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const router = express.Router();

router.use(authenticateUser, authorizeRoles('publisher'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/earnings', getEarnings);
router.get('/sales-analytics', getSalesAnalytics);
router.get('/orders', getOrders);

export default router;

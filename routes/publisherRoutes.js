import express from 'express';
import {
    getEarnings,
    getSalesAnalytics,
    getPublisherOrders,
    getPublisherProfile,
    updatePublisherProfile,
} from '../controllers/publisherController.js';
import { authenticateUser } from '../middlewares/authenticateUsers.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const router = express.Router();

router.use(authenticateUser, authorizeRoles('publisher'));

router.get('/earnings', getEarnings);
router.get('/sales-analytics', getSalesAnalytics);
router.get('/orders', getPublisherOrders);
router.get('/profile', getPublisherProfile);
router.put('/profile', updatePublisherProfile);

export default router;

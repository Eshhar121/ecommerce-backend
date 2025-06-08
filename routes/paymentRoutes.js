import express from 'express';
import { createCheckoutSession, payOrder } from '../controllers/paymentController.js';
import { authenticateUser } from '../middlewares/authenticateUsers.js';

const router = express.Router();

router.post('/create-checkout-session', authenticateUser, createCheckoutSession);
router.put('/:orderId/pay', authenticateUser, payOrder);

export default router;

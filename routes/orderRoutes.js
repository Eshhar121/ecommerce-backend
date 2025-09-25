import express from 'express';
import {
  placeOrder,
  getUserOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { authenticateUser } from '../middlewares/authenticateUsers.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const router = express.Router();

router.use(authenticateUser);
router.post('/', placeOrder);
router.get('/', getUserOrders);
router.patch(
    '/:orderId/status',
    authorizeRoles('admin'),
    updateOrderStatus
);

export default router;
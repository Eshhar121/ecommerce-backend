import express from 'express';
import {
  placeOrder,
  getUserOrders,
  getAllOrders,
  markAsDelivered,
} from '../controllers/orderController.js';
import { authenticateUser } from '../middlewares/authenticateUsers.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const router = express.Router();

router.use(authenticateUser);
router.post('/place', placeOrder);
router.get('/my', getUserOrders);
router.get('/all', authorizeRoles('admin'), getAllOrders);
router.put('/admin/order/:orderId/deliver', authorizeRoles('admin'), markAsDelivered);

export default router;

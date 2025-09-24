import express from 'express';
import {
  placeOrder,
  getUserOrders,
} from '../controllers/orderController.js';
import { authenticateUser } from '../middlewares/authenticateUsers.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const router = express.Router();

router.use(authenticateUser);
router.post('/place', placeOrder);
router.get('/my', getUserOrders);


export default router;

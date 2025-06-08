import express from 'express';
import {
    addToCart,
    getCart,
    removeFromCart,
    checkout,
    clearCart
} from '../controllers/cartController.js';
import { authenticateUser } from '../middlewares/authenticateUsers.js';

const router = express.Router();

router.use(authenticateUser); // all routes need auth
router.get('/', getCart);
router.post('/', addToCart);
router.delete('/clear', clearCart);
router.post('/checkout', checkout);
router.delete('/:productId', removeFromCart);

export default router;

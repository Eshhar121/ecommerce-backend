import express from 'express';
import { authenticateUser } from '../middlewares/authenticateUsers.js';
import { addToWishlist, removeFromWishlist, getWishlist } from '../controllers/wishlistController.js';

const router = express.Router();

// Wishlist
router.get('/', authenticateUser, getWishlist);
router.post('/:productId', authenticateUser, addToWishlist);
router.delete('/:productId', authenticateUser, removeFromWishlist);

export default router;

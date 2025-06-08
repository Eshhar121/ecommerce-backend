import express from 'express';
import { authenticateUser } from '../middlewares/authenticateUsers.js';
import { addToWishlist, removeFromWishlist, getWishlist } from '../controllers/wishlistController.js';

const router = express.Router();

// Wishlist
router.get('/wishlist', authenticateUser, getWishlist);
router.post('/wishlist/:productId', authenticateUser, addToWishlist);
router.delete('/wishlist/:productId', authenticateUser, removeFromWishlist);

export default router;

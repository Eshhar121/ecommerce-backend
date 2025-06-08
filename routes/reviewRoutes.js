import express from 'express';
import { authenticateUser } from '../middlewares/authenticateUsers.js';
import { addReview, getProductReviews } from '../controllers/reviewController.js';

const router = express.Router();

router.use(authenticateUser);
router.post('/reviews', addReview);
router.get('/reviews/:productId', getProductReviews);

export default router;

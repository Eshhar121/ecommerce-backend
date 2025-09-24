import express from 'express';
import {
    addReview,
    getProductReviews,
    getPublisherReviews,
    updateReview,
    deleteReview,
} from '../controllers/reviewController.js';
import { authenticateUser } from '../middlewares/authenticateUsers.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const router = express.Router();

router.get('/publisher', authenticateUser, authorizeRoles('publisher'), getPublisherReviews);
router.get('/:productId', getProductReviews);

router.post('/', authenticateUser, addReview);
router.put('/:id', authenticateUser, updateReview);
router.delete('/:id', authenticateUser, deleteReview);

export default router;

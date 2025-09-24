import express from 'express';
import {
    getProfile,
    updateProfile,
    becomePublisher,
    getMyReviews,
} from '../controllers/userController.js';
import { authenticateUser } from '../middlewares/authenticateUsers.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/', getProfile);
router.put('/', updateProfile);
router.post('/become-publisher', becomePublisher);
router.get('/reviews', getMyReviews);

export default router;
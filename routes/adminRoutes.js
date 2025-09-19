import express from 'express';
import { getStats } from '../controllers/adminController.js';
import { authenticateUser } from '../middlewares/authenticateUsers.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const router = express.Router();

router.use(authenticateUser, authorizeRoles('admin'));

router.get('/stats', getStats);

export default router;

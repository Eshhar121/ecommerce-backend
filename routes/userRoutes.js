import express from 'express';
import { authenticateUser } from '../middlewares/authenticateUsers.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';
import { getAdminStats } from '../controllers/adminController.js';

const router = express.Router();

router.get('/stats', authenticateUser, authorizeRoles('admin'), getAdminStats);

export default router;
import express from 'express';
import {
    getUsers,
    updateUserRole,
    deleteUser,
} from '../controllers/adminController.js';
import { authenticateUser } from '../middlewares/authenticateUsers.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const router = express.Router();

router.use(authenticateUser, authorizeRoles('admin'));

router.get('/', getUsers);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

export default router;

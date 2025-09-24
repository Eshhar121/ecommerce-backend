import express from 'express';
import {
  getOverviewStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getAllOrders,
  markOrderAsDelivered,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteReview,
  getLogs,
  getSettings,
  updateSettings,
} from '../controllers/adminController.js';
import { authenticateUser } from '../middlewares/authenticateUsers.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const router = express.Router();

// All routes in this file are protected and only accessible by admins
router.use(authenticateUser, authorizeRoles('admin'));

// Overview
router.get('/overview', getOverviewStats);

// User Management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Product Management
router.get('/products', getAllProducts);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Order Management
router.get('/orders', getAllOrders);
router.put('/orders/:id/deliver', markOrderAsDelivered);

// Category Management
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

router.delete('/reviews/:id', deleteReview);

// Logs
router.get('/logs', getLogs);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

export default router;
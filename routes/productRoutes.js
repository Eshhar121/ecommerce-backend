import express from 'express';
import {
    addProduct,
    getProducts,
    getPublisherProducts,
    updateProduct,
    deleteProduct,
    getProductStats,
} from '../controllers/productController.js';
import { authenticateUser } from '../middlewares/authenticateUsers.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', authenticateUser, authorizeRoles('publisher'), upload.single('image'), addProduct);

router.get('/publisher', authenticateUser, authorizeRoles('publisher'), getPublisherProducts);
router.get('/stats', authenticateUser, authorizeRoles('admin'), getProductStats);

router.put('/:id', authenticateUser, authorizeRoles('publisher', 'admin'), upload.single('image'), updateProduct);
router.delete('/:id', authenticateUser, authorizeRoles('publisher', 'admin'), deleteProduct);

export default router;
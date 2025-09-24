import express from 'express';
import {
    addProduct,
    getProducts,
    getPublisherProducts,
    updateProduct,
    deleteProduct,
} from '../controllers/productController.js';
import { authenticateUser } from '../middlewares/authenticateUsers.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', authenticateUser, authorizeRoles('publisher'), upload.single('image'), addProduct);

router.get('/publisher', authenticateUser, authorizeRoles('publisher'), getPublisherProducts);

router.put('/:id', authenticateUser, authorizeRoles('publisher'), upload.single('image'), updateProduct);
router.delete('/:id', authenticateUser, authorizeRoles('publisher'), deleteProduct);

export default router;
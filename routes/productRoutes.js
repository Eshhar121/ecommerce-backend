import express from 'express';
import { addProduct, getProducts } from '../controllers/productController.js';
import { authenticateUser } from '../middlewares/authenticateUsers.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.get('/', getProducts); 
router.post('/', authenticateUser, upload.single('image'), authorizeRoles('admin'), addProduct);

export default router;
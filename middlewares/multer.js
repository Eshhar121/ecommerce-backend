import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'products', 
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

export const upload = multer({ storage });

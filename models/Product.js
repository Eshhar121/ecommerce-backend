import mongoose from 'mongoose';
import { reviewSchema } from './Review.js';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: '',
        },
        price: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
        },
        category: {
            type: String,
        },
        tags: {
            type: [String]
        },
        reviews: [reviewSchema],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Product', productSchema);

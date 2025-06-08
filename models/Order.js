import mongoose from 'mongoose';
import { reviewSchema } from './Review.js';

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product' 
      },
      name: String,
      quantity: Number,
      price: Number,
    }
  ],
  totalPrice: { 
    type: Number, 
    required: true 
  },
  isPaid: { 
    type: Boolean, 
    default: false 
  },
  paidAt: { 
    type: Date 
  },
  status: {
    type: String,
    enum: ['processing', 'shipped', 'delivered'],
    default: 'processing'
  },
  createdAt: { 
    type: Date, 
    default:Date.now 
  },
  reviewSchema: [reviewSchema],
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
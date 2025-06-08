import mongoose from 'mongoose';

const userId = new mongoose.Types.ObjectId();
const productId = new mongoose.Types.ObjectId();
const orderId = new mongoose.Types.ObjectId();

// 🧑 Mock User
export const mockUser = {
  _id: '6841a6faced5f97ac5441151',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedpassword123', 
  isVerified: false,
  role: 'user',
  cart: [
    {
      productId: productId.toString(),
      quantity: 2
    }
  ],
  wishlist: [productId],
  createdAt: new Date(),
};

// 📦 Mock Product
export const mockProduct = {
  _id: productId,
  name: 'Mock Product',
  description: 'This is a mock product description',
  image: 'https://via.placeholder.com/150',
  price: 29.99,
  stock: 100,
  category: 'electronics',
  tags: ['mock', 'test'],
  reviews: [
    {
      user: userId,
      product: productId,
      order: orderId,
      rating: 5,
      comment: 'Excellent product!',
      createdAt: new Date()
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
};

// 🛒 Mock Cart
export const mockCart = {
  _id: new mongoose.Types.ObjectId(),
  userId: userId,
  items: [
    {
      productId: productId,
      name: 'Mock Product',
      price: 29.99,
      quantity: 2
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
};

// 📬 Mock Order
export const mockOrder = {
  _id: orderId,
  user: userId,
  items: [
    {
      product: productId,
      name: 'Mock Product',
      quantity: 2,
      price: 29.99
    }
  ],
  totalPrice: 59.98,
  isPaid: true,
  paidAt: new Date(),
  status: 'shipped',
  createdAt: new Date(),
  reviewSchema: [
    {
      user: userId,
      product: productId,
      order: orderId,
      rating: 5,
      comment: 'Delivered fast and in great condition!',
      createdAt: new Date()
    }
  ]
};

// ⭐ Mock Review
export const mockReview = {
  _id: new mongoose.Types.ObjectId(),
  user: userId,
  product: productId,
  order: orderId,
  rating: 4,
  comment: 'Solid quality but a bit pricey.',
  createdAt: new Date()
};

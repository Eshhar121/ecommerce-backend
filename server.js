import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import wishListRoutes from './routes/wishListRoutes.js';
import publisherRoutes from './routes/publisherRoutes.js';

import adminRoutes from './routes/adminRoutes.js';


dotenv.config(); // Load .env values

const app = express();

// === MIDDLEWARES ===
app.use(helmet()); // Sets security headers
app.use(cors({
  origin: process.env.CLIENT_URL, // Allow frontend to hit backend
  credentials: true, // Send cookies with request
}));
app.use(express.json()); // Parse JSON in req.body
app.use(cookieParser()); // Enable cookie access

// === MONGO DB ===
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// === ROUTES ===
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishListRoutes);
app.use('/api/publisher', publisherRoutes);

app.use('/api/admin', adminRoutes);


// === START SERVER ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
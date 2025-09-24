import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Category from '../models/Category.js';
import Setting from '../models/Setting.js';

// Overview
export const getOverviewStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const productsCount = await Product.countDocuments();
    const ordersCount = await Order.countDocuments();

    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    res.status(200).json({
      users: usersCount,
      products: productsCount,
      orders: ordersCount,
      revenue: totalRevenue,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// User Management
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: `User role updated for user ${req.params.id}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: `User ${req.params.id} deleted` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Product Management
export const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const total = await Product.countDocuments();
        const products = await Product.find()
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            products,
            page,
            totalPages: Math.ceil(total / limit),
            totalProducts: total,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    try {
        const updateData = { name, description, price, stock, category };
        if (req.file) {
            updateData.image = req.file.path;
        }

        const product = await Product.findByIdAndUpdate(id, updateData, { new: true });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product updated', product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update product' });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete product' });
    }
};

// Order Management
export const getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const total = await Order.countDocuments();
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            orders,
            page,
            totalPages: Math.ceil(total / limit),
            totalOrders: total,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const markOrderAsDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'email name');

        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (order.isDelivered) return res.status(400).json({ message: 'Already delivered' });

        order.isDelivered = true;
        order.deliveredAt = Date.now();
        await order.save();

        // ✉️ Send notification email
        const reviewLink = `${process.env.CLIENT_URL}/review/${order._id}`;
        const emailBody = `
            <p>Hi ${order.user.name},</p>
            <p>Your order <strong>#${order._id}</strong> has been delivered.</p>
            <p>We’d love to hear your thoughts! Please leave a review:</p>
            <a href="${reviewLink}">Review your order</a>
        `;

        await sendEmail({
            to: order.user.email,
            subject: 'Your order has been delivered!',
            html: emailBody,
        });

        res.status(200).json({ message: 'Order marked as delivered, user notified.' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to mark as delivered' });
    }
};

// Category Management
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = new Category({ name, description });
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await Category.findByIdAndUpdate(req.params.id, { name, description }, { new: true });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

import Review from '../models/Review.js';

// Logs
export const getLogs = async (req, res) => {
  // Dummy implementation
  res.status(200).json({ message: 'System logs' });
};

export const deleteReview = async (req, res) => {
    const { id } = req.params;

    try {
        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        await review.remove();

        res.json({ message: 'Review deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete review' });
    }
};

// Settings
export const getSettings = async (req, res) => {
    try {
        const settings = await Setting.find();
        const settingsObject = settings.reduce((acc, setting) => {
            acc[setting.name] = setting.value;
            return acc;
        }, {});
        res.status(200).json(settingsObject);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const { settings } = req.body;
        for (const key in settings) {
            await Setting.findOneAndUpdate({ name: key }, { value: settings[key] }, { upsert: true });
        }
        res.status(200).json({ message: 'Settings updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

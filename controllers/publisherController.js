import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Get publisher profile
export const getProfile = async (req, res) => {
    try {
        const publisher = await User.findById(req.user.userId).select('-password');
        res.json({ publisher });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update publisher profile
export const updateProfile = async (req, res) => {
    const { name, email } = req.body;
    try {
        const publisher = await User.findById(req.user.userId);

        if (!publisher) {
            return res.status(404).json({ message: 'Publisher not found' });
        }

        publisher.name = name || publisher.name;
        publisher.email = email || publisher.email;

        await publisher.save();

        res.json({ message: 'Profile updated', publisher });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update profile' });
    }
};

// Get earnings for the current publisher
export const getEarnings = async (req, res) => {
    try {
        // This is a placeholder. A real implementation would calculate earnings from completed orders.
        const earnings = 12345.67;
        res.json({ earnings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get sales analytics for the current publisher
export const getSalesAnalytics = async (req, res) => {
    try {
        // This is a placeholder. A real implementation would generate sales analytics.
        const analytics = { totalSales: 100, totalOrders: 50 };
        res.json({ analytics });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get orders for the current publisher
export const getOrders = async (req, res) => {
    try {
        const products = await Product.find({ publisher: req.user.userId });
        const productIds = products.map(p => p._id);
        const orders = await Order.find({ 'items.product': { $in: productIds } }).populate('user', 'name');
        res.json({ orders });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

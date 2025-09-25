import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

export const getEarnings = async (req, res) => {
    try {
        const publisherId = req.user.id;
        // Dummy implementation for now
        res.status(200).json({ totalEarnings: 1500, monthlyEarnings: 300 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getSalesAnalytics = async (req, res) => {
    try {
        const publisherId = req.user.id;
        // Dummy implementation for now
        res.status(200).json({ totalSales: 100, averageOrderValue: 50 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getPublisherOrders = async (req, res) => {
    try {
        const publisherId = req.user.id;
        const products = await Product.find({ publisher: publisherId });
        const productIds = products.map(p => p._id);

        const orders = await Order.find({ 'items.product': { $in: productIds } })
            .populate('user', 'name email')
            .populate('items.product', 'name');

        res.status(200).json({ orders });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getPublisherProfile = async (req, res) => {
    try {
        const publisherId = req.user.id;
        const user = await User.findById(publisherId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Publisher not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updatePublisherProfile = async (req, res) => {
    try {
        const publisherId = req.user.id;
        const { name, email, brandName, bio } = req.body; // Add other fields as needed

        const user = await User.findByIdAndUpdate(publisherId, { name, email, brandName, bio }, { new: true }).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Publisher not found' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

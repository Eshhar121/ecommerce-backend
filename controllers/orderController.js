import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import { sendEmail, sendOrderConfirmationEmail } from '../utils/mail.js';

export const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ user: userId });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const order = new Order({
            user: userId,
            items: cart.items.map(item => ({
                product: item.product,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
            })),
            totalPrice: cart.total,
        });

        await order.save();
        await Cart.findOneAndDelete({ user: userId });

        // ✅ Email send here
        const user = await User.findById(userId);
        await sendOrderConfirmationEmail(user.email, order);

        res.status(201).json({ message: 'Order placed', order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to place order' });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const total = await Order.countDocuments({ user: req.user.id });
        const orders = await Order.find({ user: req.user.id })
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
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
};

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

export const markAsDelivered = async (req, res) => {
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
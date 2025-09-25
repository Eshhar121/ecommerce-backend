import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import { sendOrderConfirmationEmail } from '../utils/mail.js';
import { getIO } from '../socket.js';

export const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const order = new Order({
            user: userId,
            items: cart.items.map(item => ({
                product: item.product._id,
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.price,
            })),
            totalPrice: cart.total,
        });

        await order.save();
        await Cart.findOneAndDelete({ user: userId });

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

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId).populate('user');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        const io = getIO();
        io.to(order.user._id.toString()).emit('order:status-update', order);

        res.status(200).json({ message: 'Order status updated', order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update order status' });
    }
};
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

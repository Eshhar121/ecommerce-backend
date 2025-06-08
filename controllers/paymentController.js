import stripe from '../config/stripe.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import { sendOrderConfirmationEmail } from '../utils/mail.js';

export const createCheckoutSession = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ user: userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty or not found' });
        }

        const line_items = cart.items.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        const order = new Order({
            user: userId,
            items: cart.items.map(item => ({
                product: item.product,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
            })),
            shippingAddress: req.body.shippingAddress,
            paymentMethod: 'Stripe',
            totalPrice: cart.total,
            isPaid: false,
        });

        await order.save();

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
            metadata: {
                orderId: order._id.toString(),
            },
        });

        res.json({ url: session.url });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Stripe checkout error' });
    }
};

export const payOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId).populate('user');

        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.isPaid) return res.status(400).json({ message: 'Order already paid' });

        order.isPaid = true;
        order.paidAt = Date.now();

        await order.save();

        // ✅ Email send here
        await sendOrderConfirmationEmail(order.user.email, order);

        res.status(200).json({ message: 'Payment successful', order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Payment failed' });
    }
};
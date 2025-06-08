import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Add item to cart
export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [{ productId, quantity }] });
        } else {
            const itemIndex = cart.items.findIndex(i => i.productId.toString() === productId); // Check if item already exists in cart

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }
        }

        await cart.save();
        res.status(200).json(cart);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding to cart' });
    }
};

// Get user's cart
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
        if (!cart) return res.json({ items: [] });
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving cart' });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    const { productId } = req.params;
    try {
        let cart = await Cart.findOne({ userId: req.user.id });
        cart.items = cart.items.filter(i => i.productId.toString() !== productId);
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Error removing item' });
    }
};


export const clearCart = async (req, res) => {
    try {
        await Cart.findOneAndDelete({ userId: req.user.id });
        res.status(200).json({ message: 'Cart cleared' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error clearing cart' });
    }
};

export const checkout = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty!' });
        }

        for (const item of cart.items) {
            const product = await Product.findById(item.productId);
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}.corry!` });
            }
            product.stock -= item.quantity;
            await product.save();
        }

        // Clear cart
        cart.items = [];
        await cart.save();

        res.json({ message: 'Checkout successful' });

    } catch (err) {
        res.status(500).json({ message: 'Checkout failed' });
    }
};

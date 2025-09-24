import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

export const getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user.userId }).populate('items.product');
        res.status(200).json(wishlist);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.userId;

        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, items: [] });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const itemIndex = wishlist.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        } else {
            wishlist.items.push({ product: productId });
        }

        await wishlist.save();
        res.status(200).json({ message: 'Product added to wishlist', wishlist });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.userId;

        const wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        wishlist.items = wishlist.items.filter(item => item.product.toString() !== productId);

        await wishlist.save();
        res.status(200).json({ message: 'Product removed from wishlist', wishlist });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

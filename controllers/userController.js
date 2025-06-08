// Add a product to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user.wishlist.includes(req.params.productId)) {
            user.wishlist.push(req.params.productId);
            await user.save();
        }

        res.status(200).json({ message: 'Product added to wishlist' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to add product to wishlist' });
    }
};

// Remove a product from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        user.wishlist = user.wishlist.filter(
            (item) => item.toString() !== req.params.productId
        );

        await user.save();
        res.status(200).json({ message: 'Product removed from wishlist' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to remove product from wishlist' });
    }
};

// Get user wishlist products
export const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('wishlist');
        res.status(200).json(user.wishlist);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch wishlist' });
    }
};

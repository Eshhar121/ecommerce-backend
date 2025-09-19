import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Product from '../models/Product.js';

export const addReview = async (req, res) => {
  const { productId, orderId, rating, comment } = req.body;
  const userId = req.user.id;

  try {
    // Ensure order exists, belongs to user, and is delivered
    const order = await Order.findOne({ _id: orderId, user: userId, status: 'delivered' });
    if (!order) {
      return res.status(400).json({ message: 'You can only review delivered orders.' });
    }

    // Ensure the product is in the order
    const productInOrder = order.items.some(item => item.product.toString() === productId);
    if (!productInOrder) {
      return res.status(400).json({ message: 'This product was not part of your order.' });
    }

    // Prevent duplicate reviews
    const existing = await Review.findOne({ user: userId, product: productId, order: orderId });
    if (existing) {
      return res.status(400).json({ message: 'You already reviewed this item.' });
    }

    // Create and save review
    const review = new Review({
      user: userId,
      product: productId,
      order: orderId,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json({ message: 'Review submitted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add review' });
  }
};

export const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
        res.status(200).json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch reviews' });
    }
};

// Get reviews for all products of a logged-in publisher
export const getPublisherReviews = async (req, res) => {
    try {
        const publisherId = req.user.userId;
        const products = await Product.find({ publisher: publisherId });
        const productIds = products.map(p => p._id);
        const reviews = await Review.find({ product: { $in: productIds } }).populate('user', 'name').populate('product', 'name');
        res.json({ reviews });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a review (owner only)
export const updateReview = async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;

    try {
        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check authorization
        if (review.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to update this review' });
        }

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;

        await review.save();

        res.json({ message: 'Review updated', review });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update review' });
    }
};

// Delete a review (owner or admin)
export const deleteReview = async (req, res) => {
    const { id } = req.params;

    try {
        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check authorization
        if (req.user.role !== 'admin' && review.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }

        await review.remove();

        res.json({ message: 'Review deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete review' });
    }
};


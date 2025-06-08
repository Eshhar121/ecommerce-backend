import Order from '../models/Order.js';
import Review from '../models/Review.js';

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

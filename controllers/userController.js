import User from '../models/User.js';
import Review from '../models/Review.js';

// Get user profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    const { name, email } = req.body;
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;

        await user.save();

        res.json({ message: 'Profile updated', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update profile' });
    }
};

// Request to become a publisher
export const becomePublisher = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // In a real app, this might involve a review process
        user.role = 'publisher';
        await user.save();

        res.json({ message: 'Congratulations! You are now a publisher.', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get reviews by the current user
export const getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user.userId });
        res.json({ reviews });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
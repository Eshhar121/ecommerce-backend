import User from '../models/User.js';

// Get system stats
export const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPublishers = await User.countDocuments({ role: 'publisher' });
        // Add more stats as needed
        res.json({ totalUsers, totalPublishers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all users (admin only)
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({ users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user role (admin only)
export const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.json({ message: 'User role updated', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update user role' });
    }
};

// Delete a user (admin only)
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.remove();

        res.json({ message: 'User deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete user' });
    }
};

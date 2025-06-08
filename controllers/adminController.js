import Order from '../models/Order.js';
import User from '../models/User.js';

export const getAdminStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalRevenueData = await Order.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]);
        const totalRevenue = totalRevenueData[0]?.total || 0;

        const totalUsers = await User.countDocuments();

        res.json({
            totalOrders,
            totalRevenue,
            totalUsers,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch admin stats' });
    }
};

const { connectToDatabase, userSchema } = require('./_db');
const mongoose = require('mongoose');

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    try {
        await connectToDatabase();
        const User = mongoose.models.User || mongoose.model('User', userSchema);
        const citizens = await User.find({ uin: { $exists: true, $ne: null } })
            .select('name email phone uin -_id');
        res.json(citizens);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

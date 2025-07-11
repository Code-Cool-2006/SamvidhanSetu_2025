const { connectToDatabase, userSchema } = require('./_db');
const mongoose = require('mongoose');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    try {
        await connectToDatabase();
        const User = mongoose.models.User || mongoose.model('User', userSchema);
        const { uin } = req.body;

        // Basic validation
        if (!uin || uin.length !== 10) {
            return res.status(400).json({ message: 'Invalid UIN format' });
        }

        // Check if UIN exists in database
        const user = await User.findOne({ uin });
        if (!user) {
            return res.status(401).json({ message: 'Invalid UIN' });
        }

        res.json({
            message: 'UIN verified successfully',
            user: {
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

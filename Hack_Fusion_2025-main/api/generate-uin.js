const { connectToDatabase, userSchema } = require('./_db');
const mongoose = require('mongoose');

function generateUIN() {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    try {
        await connectToDatabase();
        const User = mongoose.models.User || mongoose.model('User', userSchema);
        const { email } = req.body;

        // Find the user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user already has a UIN
        if (user.uin) {
            return res.status(400).json({ message: 'User already has a UIN' });
        }

        // Generate and save UIN
        let uin;
        let isUnique = false;
        while (!isUnique) {
            uin = generateUIN();
            const existingUser = await User.findOne({ uin });
            if (!existingUser) {
                isUnique = true;
            }
        }

        user.uin = uin;
        await user.save();

        res.json({
            message: 'UIN generated successfully',
            uin: uin
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

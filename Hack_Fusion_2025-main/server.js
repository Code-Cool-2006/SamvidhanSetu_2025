const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/employee_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});
// mongoose.connect('mongodb://localhost:27017/admins', { useNewUrlParser: true, useUnifiedTopology: true });
// // Admin schema
// const Admin = mongoose.model('Admin', new mongoose.Schema({
//     username: String,
//     email: String,
//     password: String
// }));

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    uin: { type: String, unique: true, sparse: true }
});

const User = mongoose.model('User', userSchema);

// Generate UIN function
function generateUIN() {
    // Generate a 10-digit UIN
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

// Register Route
app.post('/api/register', async (req, res) => {
    try {
        const { email, name, phone, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            email,
            name,
            phone,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Validate password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.json({ message: 'Login successful', user: { email: user.email, name: user.name } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Generate UIN Route
app.post('/api/generate-uin', async (req, res) => {
    try {
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
});

// GET all citizens (for ManageUsers.html)
app.get('/api/citizens', async (req, res) => {
    try {
        // Only return users with a UIN (citizen accounts)
        const citizens = await User.find({ uin: { $exists: true, $ne: null } })
            .select('name email phone uin -_id');
        res.json(citizens);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// UIN Verification Route
app.post('/api/verify-uin', async (req, res) => {
    try {
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
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
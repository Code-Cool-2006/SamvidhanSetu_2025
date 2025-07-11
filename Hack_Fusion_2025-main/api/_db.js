const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let conn = null;

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    uin: { type: String, unique: true, sparse: true }
});

async function connectToDatabase() {
    if (conn == null) {
        conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
    return conn;
}

module.exports = { connectToDatabase, userSchema, bcrypt };

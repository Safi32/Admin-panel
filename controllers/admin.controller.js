const Admin = require('../models/admin.model');
const jwt = require('jsonwebtoken');

const generateToken = (adminId) => {
    return jwt.sign({ id: adminId }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '24h'
    });
};

exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = generateToken(admin._id);
        res.json({
            success: true,
            message: 'Admin login successful',
            data: {
                token,
                admin: {
                    id: admin._id,
                    username: admin.username,
                    email: admin.email,
                    role: admin.role
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error in admin login', error: error.message });
    }
};

exports.adminRegister = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: 'Admin already exists with this email or username' });
        }
        const admin = new Admin({ username, email, password, role });
        await admin.save();
        const token = generateToken(admin._id);
        res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            data: {
                token,
                admin: {
                    id: admin._id,
                    username: admin.username,
                    email: admin.email,
                    role: admin.role
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error in admin registration', error: error.message });
    }
}; 
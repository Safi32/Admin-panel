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
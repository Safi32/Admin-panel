const User = require('../models/user.model');
const { validationResult } = require('express-validator');

// Cache duration in seconds
const CACHE_DURATION = 300; // 5 minutes

// In-memory cache
const cache = new Map();

exports.getUsers = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Get query parameters with defaults
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const search = req.query.search || '';
        const role = req.query.role;
        const isActive = req.query.isActive;

        // Create cache key based on query parameters
        const cacheKey = `users_${page}_${limit}_${sortBy}_${sortOrder}_${search}_${role}_${isActive}`;

        // Check cache first
        if (cache.has(cacheKey)) {
            const cachedData = cache.get(cacheKey);
            if (Date.now() - cachedData.timestamp < CACHE_DURATION * 1000) {
                return res.json(cachedData.data);
            }
            cache.delete(cacheKey);
        }

        // Build query
        const query = {};
        
        // Add search condition if search term exists
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Add role filter if specified
        if (role) {
            query.role = role;
        }

        // Add active status filter if specified
        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

        // Execute query with optimization
        const [users, total] = await Promise.all([
            User.find(query)
                .select('-password') // Exclude password field
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit)
                .lean(), // Use lean() for better performance
            User.countDocuments(query)
        ]);

        // Calculate pagination metadata
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        // Prepare response data
        const responseData = {
            success: true,
            data: {
                users,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: total,
                    itemsPerPage: limit,
                    hasNextPage,
                    hasPrevPage
                }
            }
        };

        // Cache the response
        cache.set(cacheKey, {
            data: responseData,
            timestamp: Date.now()
        });

        res.json(responseData);
    } catch (error) {
        console.error('Error in getUsers:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.getTotalReferrals = async (req, res) => {
    try {
        const totalReferrals = await User.countDocuments({ referredBy: { $ne: null } });
        res.json({ success: true, totalReferrals });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching total referrals', error: error.message });
    }
};

exports.banUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, message: 'User banned', user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error banning user', error: error.message });
    }
};

exports.unbanUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { isActive: true }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, message: 'User unbanned', user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error unbanning user', error: error.message });
    }
};

exports.manualCoinTransfer = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;
        if (amount <= 0) return res.status(400).json({ success: false, message: 'Amount must be positive' });
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        user.balance = (user.balance || 0) + amount;
        await user.save();
        res.json({ success: true, message: 'Coins transferred', user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error transferring coins', error: error.message });
    }
}; 
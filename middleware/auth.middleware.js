const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Middleware: Protect routes using JWT
exports.protect = async (req, res, next) => {
  try {
    let token = null;

    // ✅ Extract token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ❌ No token found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Access denied.",
      });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");

    // ✅ Lookup user in DB
    const user = await User.findById(decoded.id).select("-password");

    // ❌ User not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Access denied.",
      });
    }

    // ❌ User deactivated
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "User account is deactivated.",
      });
    }

    // ✅ Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("🔒 Token verification failed:", error.message);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
};

// Middleware: Restrict to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user?.role || 'unknown'}' is not authorized.`,
      });
    }
    next();
  };
};

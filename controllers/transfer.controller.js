const Transfer = require("../models/transfer.model");
const User = require("../models/user.model");

/** 
 * POST /users/:userId/coin-transfer
 */
exports.transferCoins = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount, reason = "Manual transfer" } = req.body;
    const admin = req.user; // from auth middleware

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const previousBalance = user.balance || 0;
    const newBalance = previousBalance + Number(amount);

    user.balance = newBalance;
    await user.save();

    const transfer = await Transfer.create({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      amount,
      reason,
      transferredBy: admin?.name || "System",
      adminId: admin?._id || null,
      balanceBefore: previousBalance,
      balanceAfter: newBalance,
    });

    return res.status(200).json({
      message: "Transfer successful",
      transferId: transfer.transactionId,
      newBalance: user.balance,
      user,
      reason,
      timestamp: transfer.createdAt,
    });
  } catch (err) {
    console.error("Transfer error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET /transfers/history
 * Supports filters: page, limit, status, userId, dateRange
 */
exports.getTransferHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, userId, startDate, endDate } = req.query;

    const filters = {};

    if (status) filters.status = status;
    if (userId) filters.userId = userId;
    if (startDate && endDate) {
      filters.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const total = await Transfer.countDocuments(filters);
    const transfers = await Transfer.find(filters)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    return res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      transfers,
    });
  } catch (err) {
    console.error("Transfer history error:", err);
    return res.status(500).json({ message: "Failed to fetch transfer history" });
  }
};

/**
 * GET /transfers/:id
 */
exports.getTransferById = async (req, res) => {
  try {
    const { id } = req.params;
    const transfer = await Transfer.findById(id);
    if (!transfer) return res.status(404).json({ message: "Transfer not found" });
    return res.status(200).json(transfer);
  } catch (err) {
    console.error("Get transfer error:", err);
    return res.status(500).json({ message: "Failed to fetch transfer" });
  }
};

/**
 * PATCH /transfers/:id/status
 * Body: { status: "completed" | "pending" | "failed" }
 */
exports.updateTransferStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["completed", "pending", "failed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const transfer = await Transfer.findById(id);
    if (!transfer) return res.status(404).json({ message: "Transfer not found" });

    transfer.status = status;
    await transfer.save();

    return res.status(200).json({ message: "Status updated", transfer });
  } catch (err) {
    console.error("Update transfer status error:", err);
    return res.status(500).json({ message: "Failed to update transfer status" });
  }
};
module.exports = {
  transferCoins: exports.transferCoins,
  getTransferHistory: exports.getTransferHistory,
  getTransferById: exports.getTransferById,
  updateTransferStatus: exports.updateTransferStatus,
};

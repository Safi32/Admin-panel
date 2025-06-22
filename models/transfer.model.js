const mongoose = require("mongoose");

const TransferSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
    },
    userEmail: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      default: "Manual transfer",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
    transferredBy: {
      type: String, // admin name or system
      default: "System",
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    balanceBefore: {
      type: Number,
      default: 0,
    },
    balanceAfter: {
      type: Number,
      default: 0,
    },
    transactionId: {
      type: String,
      unique: true,
      default: function () {
        return `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transfer", TransferSchema);

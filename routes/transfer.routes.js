const express = require("express");
const router = express.Router();
const transferController = require("../controllers/transfer.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");

// Manual coin transfer to user
router.post("/users/:userId/coin-transfer", verifyToken, isAdmin, transferController.transferCoins);

// Transfer history & management
router.get("/transfers/history", verifyToken, isAdmin, transferController.getTransferHistory);
router.get("/transfers/:id", verifyToken, isAdmin, transferController.getTransferById);
router.patch("/transfers/:id/status", verifyToken, isAdmin, transferController.updateTransferStatus);

module.exports = router;

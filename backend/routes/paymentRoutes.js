const express = require("express");
const router = express.Router();
const { createRazorpayOrder } = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/payment/razorpay-order
router.post("/razorpay-order", protect, createRazorpayOrder);

module.exports = router;

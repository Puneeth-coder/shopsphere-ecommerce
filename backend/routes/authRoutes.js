const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  sendOTP,
  verifyOTP,
  updateProfile,
} = require("../controllers/authController");

const {
  protect,
} = require("../middleware/authMiddleware");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.post("/send-otp", sendOTP);

router.post("/verify-otp", verifyOTP);

router.put("/profile", protect, updateProfile);

router.get(
  "/me",
  protect,
  getCurrentUser
);

module.exports = router;
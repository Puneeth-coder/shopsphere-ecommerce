const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateTokenAndCookie = require("../utils/generateTokenAndCookie");

const registerUser = async (req, res) => {
  try {
    console.log("===== REGISTER REQUEST =====");
    console.log(req.body);

    const { name, email, password } = req.body;
    const normalizedEmail = email ? email.trim().toLowerCase() : "";

    const userExists = await User.findOne({
      email: normalizedEmail,
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
    });

    console.log("===== USER CREATED =====");
    console.log(user);

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.log("===== REGISTER ERROR =====");
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    const normalizedEmail = email ? email.trim().toLowerCase() : "";

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (
      user &&
      (await bcrypt.compare(
        password,
        user.password
      ))
    ) {
      generateTokenAndCookie(
        res,
        user._id,
        rememberMe
      );

      return res.json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }


    res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });

  } catch (error) {
    console.log("===== LOGIN ERROR =====");
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

const getCurrentUser = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
};

const sendOTP = async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({ success: false, message: "Please provide an email or phone number" });
    }

    const cleanIdentifier = identifier.trim();
    const isEmail = cleanIdentifier.includes("@");

    let user;
    if (isEmail) {
      user = await User.findOne({ email: cleanIdentifier.toLowerCase() });
    } else {
      user = await User.findOne({ phoneNumber: cleanIdentifier });
    }

    // Auto-create user if they don't exist
    if (!user) {
      if (isEmail) {
        user = await User.create({
          name: cleanIdentifier.split("@")[0],
          email: cleanIdentifier.toLowerCase(),
          password: Math.random().toString(36).slice(-8), // random temp password
        });
      } else {
        // create with temp email
        user = await User.create({
          name: `User_${cleanIdentifier.slice(-4)}`,
          email: `${cleanIdentifier}@shopsphere.com`,
          phoneNumber: cleanIdentifier,
          password: Math.random().toString(36).slice(-8),
        });
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    console.log(`[ShopSphere OTP Service] OTP for ${cleanIdentifier} is: ${otp}`);

    if (isEmail) {
      const sendEmail = require("../utils/sendEmail");
      const htmlContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: 20px auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #0f172a; margin: 0; font-size: 1.8rem; font-weight: 800;">Shop<span style="color: #f97316;">Sphere</span></h2>
            <p style="color: #64748b; font-size: 0.9rem; margin-top: 4px;">Verification Portal</p>
          </div>
          <div style="border-top: 1px solid #f1f5f9; padding-top: 24px;">
            <p style="color: #334155; font-size: 1rem; margin-bottom: 16px;">Hello,</p>
            <p style="color: #475569; font-size: 1rem; line-height: 1.6; margin-bottom: 24px;">Thank you for registering at ShopSphere. To verify your email address, please use the 6-digit verification code below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 2.2rem; font-weight: 800; letter-spacing: 6px; color: #f97316; background-color: #fff7ed; padding: 16px 32px; border-radius: 8px; border: 1.5px dashed #ffedd5; display: inline-block; box-shadow: inset 0 2px 4px 0 rgba(0,0,0,0.02);">${otp}</span>
            </div>
            <p style="color: #e11d48; font-size: 0.85rem; font-weight: 600; text-align: center; margin-bottom: 24px;">⚠️ This code is private and expires in 10 minutes.</p>
          </div>
          <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; text-align: center;">
            <p style="color: #94a3b8; font-size: 0.8rem; margin: 0;">If you did not request this code, you can safely ignore this email.</p>
          </div>
        </div>
      `;

      try {
        await sendEmail({
          to: cleanIdentifier,
          subject: `${otp} is your ShopSphere Verification Code`,
          text: `Your ShopSphere Verification Code is ${otp}. Valid for 10 minutes.`,
          html: htmlContent,
        });
      } catch (err) {
        console.error("Failed to send real email:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to send verification email. Please verify SMTP credentials in .env.",
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email.",
    });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { identifier, otp } = req.body;

    if (!identifier || !otp) {
      return res.status(400).json({ success: false, message: "Please provide both identifier and OTP" });
    }

    const cleanIdentifier = identifier.trim();
    const isEmail = cleanIdentifier.includes("@");

    let user;
    if (isEmail) {
      user = await User.findOne({ email: cleanIdentifier.toLowerCase() });
    } else {
      user = await User.findOne({ phoneNumber: cleanIdentifier });
    }

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate token
    const generateTokenAndCookie = require("../utils/generateTokenAndCookie");
    generateTokenAndCookie(res, user._id, false);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (req.body.name) user.name = req.body.name;
    if (req.body.password) user.password = req.body.password; // pre-save will hash it!
    if (req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber;
    await user.save();
    
    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  getCurrentUser,
  logoutUser,
  sendOTP,
  verifyOTP,
  updateProfile,
};
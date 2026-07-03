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

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  getCurrentUser,
  logoutUser,
};
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// Set token as httpOnly cookie and send response
const sendTokenResponse = (admin, statusCode, res) => {
  const token = generateToken(admin._id);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  };

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
        last_login: admin.last_login,
      },
    });
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find admin by email (explicitly select password_hash since toJSON removes it)
    const admin = await Admin.findOne({ email }).select("+password_hash");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Update last_login
    admin.last_login = new Date();
    await admin.save({ validateBeforeSave: false });

    // Send token response
    sendTokenResponse(admin, 200, res);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// @desc    Logout admin (clear cookie)
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        expires: new Date(0), // expire immediately
      })
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
  }
};

// @desc    Get current logged-in admin
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // req.admin is set by the protect middleware
    res.status(200).json({
      success: true,
      admin: {
        id: req.admin._id,
        email: req.admin.email,
        last_login: req.admin.last_login,
        created_at: req.admin.created_at,
      },
    });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { login, logout, getMe };

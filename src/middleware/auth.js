const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check httpOnly cookie first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // 2. Fallback: check Authorization header (useful for testing with Postman)
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No token found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized — no token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find admin and attach to request
    const admin = await Admin.findById(decoded.id).select("-password_hash");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Not authorized — admin not found",
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Not authorized — invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Not authorized — token expired",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }
};

module.exports = { protect };

const express = require("express");
const router = express.Router();
const { login, logout, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// Public
router.post("/login", login);

// Protected
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

module.exports = router;

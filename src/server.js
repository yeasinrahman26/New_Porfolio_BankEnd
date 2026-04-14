const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ---------------------
// MIDDLEWARE
// ---------------------

// CORS — allow your Next.js frontend to make requests
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true, // required for httpOnly cookies
  }),
);

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

// ---------------------
// ROUTES
// ---------------------

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Portfolio API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API routes (will be added in subsequent steps)
app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/projects', require('./routes/projectRoutes'));
// app.use('/api/skills', require('./routes/skillRoutes'));

// ---------------------
// 404 HANDLER
// ---------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ---------------------
// GLOBAL ERROR HANDLER
// ---------------------
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

// ---------------------
// START SERVER
// ---------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

const mongoose = require("mongoose");

// Cache the connection state across serverless invocations
let isConnected = false;

const connectDB = async () => {
  // ✅ If already connected, reuse the connection
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = conn.connections[0].readyState === 1;
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
   
    throw error;
  }
};

module.exports = connectDB;

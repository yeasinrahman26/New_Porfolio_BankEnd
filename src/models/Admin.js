const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password_hash: {
    type: String,
    required: [true, "Password is required"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  last_login: {
    type: Date,
    default: null,
  },
});

// Hash password before saving
adminSchema.pre("save", async function () {
  if (!this.isModified("password_hash")) return;
  const salt = await bcrypt.genSalt(12);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);
});

// Compare entered password with stored hash
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

// Remove password_hash from JSON responses
adminSchema.methods.toJSON = function () {
  const admin = this.toObject();
  delete admin.password_hash;
  return admin;
};

module.exports = mongoose.model("Admin", adminSchema);

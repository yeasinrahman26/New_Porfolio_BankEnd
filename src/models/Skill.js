const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Skill name is required"],
    trim: true,
  },
  icon_name: {
    type: String,
    required: [true, "Icon name is required"],
    trim: true,
  },
  color: {
    type: String,
    default: "#FFFFFF",
    trim: true,
  },
  percentage: {
    type: Number,
    min: [1, "Percentage must be at least 1"],
    max: [100, "Percentage cannot exceed 100"],
    default: 50,
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: {
      values: ["Frontend", "Backend", "Database", "Tools", "Deployment"],
      message:
        "{VALUE} is not a valid category. Choose from: Frontend, Backend, Database, Tools, Deployment",
    },
  },
  order_index: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Skill", skillSchema);

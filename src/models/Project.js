const mongoose = require("mongoose");

const featureSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      required: [true, "Feature icon is required"],
    },
    title: {
      type: String,
      required: [true, "Feature title is required"],
    },
    description: {
      type: String,
      required: [true, "Feature description is required"],
    },
  },
  { _id: false },
);

// NEW: Image sub-schema for slider
const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, "Image URL is required"],
    },
    alt: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Project title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Project description is required"],
    trim: true,
  },
  overview_body: {
    type: String,
    default: null,
  },
  tags: {
    type: [String],
    default: [],
  },
  gradient: {
    type: String,
    default: null,
  },
  emoji: {
    type: String,
    default: null,
  },
  // CHANGED: from single string to array of images
  images: {
    type: [imageSchema],
    default: [],
  },
  live_url: {
    type: String,
    default: null,
  },
  github_url: {
    type: String,
    default: null,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },
  order_index: {
    type: Number,
    default: 0,
  },
  features: {
    type: [featureSchema],
    default: [],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Auto-update updated_at before saving
projectSchema.pre("save", function () {
  this.updated_at = new Date();
});

// Also update on findOneAndUpdate
projectSchema.pre("findOneAndUpdate", function () {
  this.set({ updated_at: new Date() });
});

module.exports = mongoose.model("Project", projectSchema);

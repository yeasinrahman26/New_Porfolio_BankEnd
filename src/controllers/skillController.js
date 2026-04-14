const Skill = require("../models/Skill");

// @desc    Get all skills (public — grouped by category)
// @route   GET /api/skills
// @access  Public
const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({
      category: 1,
      order_index: 1,
      created_at: -1,
    });

    // Group skills by category for easy frontend consumption
    const grouped = skills.reduce((acc, skill) => {
      const cat = skill.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills,
      grouped,
    });
  } catch (error) {
    console.error("Get skills error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching skills",
    });
  }
};

// @desc    Get skills by category
// @route   GET /api/skills/category/:category
// @access  Public
const getSkillsByCategory = async (req, res) => {
  try {
    const validCategories = [
      "Frontend",
      "Backend",
      "Database",
      "Tools",
      "Deployment",
    ];
    const { category } = req.params;

    // Capitalize first letter to match enum
    const formatted =
      category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

    if (!validCategories.includes(formatted)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Choose from: ${validCategories.join(", ")}`,
      });
    }

    const skills = await Skill.find({ category: formatted }).sort({
      order_index: 1,
      created_at: -1,
    });

    res.status(200).json({
      success: true,
      count: skills.length,
      category: formatted,
      data: skills,
    });
  } catch (error) {
    console.error("Get skills by category error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching skills",
    });
  }
};

// @desc    Get single skill by ID
// @route   GET /api/skills/:id
// @access  Public
const getSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    console.error("Get skill error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching skill",
    });
  }
};

// @desc    Create a skill
// @route   POST /api/skills
// @access  Private
const createSkill = async (req, res) => {
  try {
    const { name, icon_name, color, percentage, category, order_index } =
      req.body;

    const skill = await Skill.create({
      name,
      icon_name,
      color,
      percentage,
      category,
      order_index,
    });

    res.status(201).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }

    console.error("Create skill error:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating skill",
    });
  }
};

// @desc    Create multiple skills at once
// @route   POST /api/skills/bulk
// @access  Private
const createBulkSkills = async (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of skills",
      });
    }

    const created = await Skill.insertMany(skills, { runValidators: true });

    res.status(201).json({
      success: true,
      count: created.length,
      data: created,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }

    console.error("Bulk create skills error:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating skills",
    });
  }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private
const updateSkill = async (req, res) => {
  try {
    const { name, icon_name, color, percentage, category, order_index } =
      req.body;

    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      {
        name,
        icon_name,
        color,
        percentage,
        category,
        order_index,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }

    console.error("Update skill error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating skill",
    });
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
      data: { id: req.params.id },
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    console.error("Delete skill error:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting skill",
    });
  }
};

module.exports = {
  getSkills,
  getSkillsByCategory,
  getSkill,
  createSkill,
  createBulkSkills,
  updateSkill,
  deleteSkill,
};

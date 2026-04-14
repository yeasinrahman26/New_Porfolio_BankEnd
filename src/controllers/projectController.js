const Project = require("../models/Project");

// @desc    Get all published projects
// @route   GET /api/projects
// @access  Public
const getPublishedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: "published" }).sort({
      order_index: 1,
      created_at: -1,
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error("Get published projects error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching projects",
    });
  }
};

// @desc    Get all projects (including drafts — admin only)
// @route   GET /api/projects/all
// @access  Private
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({
      order_index: 1,
      created_at: -1,
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error("Get all projects error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching projects",
    });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    console.error("Get project error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching project",
    });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      overview_body,
      tags,
      gradient,
      emoji,
      images,
      live_url,
      github_url,
      featured,
      status,
      order_index,
      features,
    } = req.body;

    const project = await Project.create({
      title,
      description,
      overview_body,
      tags,
      gradient,
      emoji,
      images,
      live_url,
      github_url,
      featured,
      status,
      order_index,
      features,
    });

    res.status(201).json({
      success: true,
      data: project,
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

    console.error("Create project error:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating project",
    });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const {
      title,
      description,
      overview_body,
      tags,
      gradient,
      emoji,
      images,
      live_url,
      github_url,
      featured,
      status,
      order_index,
      features,
    } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        overview_body,
        tags,
        gradient,
        emoji,
        images,
        live_url,
        github_url,
        featured,
        status,
        order_index,
        features,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Project not found",
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

    console.error("Update project error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating project",
    });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      data: { id: req.params.id },
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    console.error("Delete project error:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting project",
    });
  }
};

module.exports = {
  getPublishedProjects,
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};

const express = require("express");
const router = express.Router();
const {
  getPublishedProjects,
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { protect } = require("../middleware/auth");

// Public routes
router.get("/", getPublishedProjects);
router.get("/:id", getProject);

// Private routes (admin only)
router.get("/admin/all", getAllProjects);
router.post("/", protect, createProject);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;

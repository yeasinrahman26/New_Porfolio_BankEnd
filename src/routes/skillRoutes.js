const express = require("express");
const router = express.Router();
const {
  getSkills,
  getSkillsByCategory,
  getSkill,
  createSkill,
  createBulkSkills,
  updateSkill,
  deleteSkill,
} = require("../controllers/skillController");
const { protect } = require("../middleware/auth");

// Public routes
router.get("/", getSkills);
router.get("/category/:category", getSkillsByCategory);
router.get("/:id", getSkill);

// Private routes (admin only)
router.post("/", protect, createSkill);
router.post("/bulk", protect, createBulkSkills);
router.put("/:id", protect, updateSkill);
router.delete("/:id", protect, deleteSkill);

module.exports = router;

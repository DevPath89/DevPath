const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// -----------------
// Models
const Registration = require("../models/Registration");
const OurTeam = require("../models/OurTeam");

// -----------------
// Controllers
const { adminLogin } = require("../controller/adminController");
const { userRegister, userLogin } = require("../controller/registrationController");
const {
  addTeamMember,
  getTeamMembers,
  updateTeamMember,
  deleteTeamMember,
} = require("../controller/ourTeamController");

const {
  getLectures,
  addLecture,
  updateLecture,
  deleteLecture,
  uploadVideo, // ✅ Added upload controller
} = require("../controller/lectureController");

// -----------------
// Registration Routes
router.post("/api/registration/register", userRegister);
router.post("/api/registration/login", userLogin);

// -----------------
// Admin Routes
router.post("/api/admin/login", adminLogin);

// -----------------
// Our Team CRUD Routes
router.post("/api/ourteam/add", addTeamMember);
router.get("/api/ourteam/all", getTeamMembers);
router.put("/api/ourteam/:id", updateTeamMember);
router.delete("/api/ourteam/:id", deleteTeamMember);

// -----------------
// Lectures CRUD Routes
router.get("/api/lectures", getLectures);
router.post("/api/lectures", addLecture);
router.put("/api/lectures/:id", updateLecture);
router.delete("/api/lectures/:id", deleteLecture);

// ✅ New Video Upload Route
router.post("/api/upload", uploadVideo);

// -----------------
// Dashboard Counts
router.get("/api/users/count", async (req, res) => {
  try {
    const count = await Registration.countDocuments();
    res.status(200).json({ count });
  } catch (err) {
    console.error("❌ Users Count Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.get("/api/team/count", async (req, res) => {
  try {
    const count = await OurTeam.countDocuments();
    res.status(200).json({ count });
  } catch (err) {
    console.error("❌ Team Count Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// -----------------
// Users Management
router.get("/api/users", async (req, res) => {
  try {
    const users = await Registration.find();
    res.status(200).json(users);
  } catch (err) {
    console.error("❌ Get Users Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const updatedUser = await Registration.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("❌ Update User Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.delete("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const deletedUser = await Registration.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("❌ Delete User Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// -----------------
router.get("/api/facts", (req, res) => {
  res.status(200).json({
    students: 0,
    placements: 0,
    topCompanies: 0,
    assistance: 0,
  });
});

// -----------------
module.exports = router;

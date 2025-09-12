const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Models
const Registration = require("../models/Registration");
const OurTeam = require("../models/OurTeam");
// const Report = require("../models/Report"); // Uncomment agar Report model hai

// Controllers
const { adminLogin } = require("../controller/adminController");
const { userRegister, userLogin } = require("../controller/registrationController");
const { addTeamMember, getTeamMembers, updateTeamMember, deleteTeamMember } = require("../controller/ourTeamController");

// -----------------
// Multer config for team image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// -----------------
// Registration Routes
router.post("/api/registration/register", userRegister);
router.post("/api/registration/login", userLogin);

// -----------------
// Admin Routes
router.post("/api/admin/login", adminLogin);

// -----------------
// Our Team Routes
router.post("/api/ourteam/add", upload.single("image"), addTeamMember);
router.get("/api/ourteam/all", getTeamMembers);
router.put("/api/ourteam/:id", upload.single("image"), updateTeamMember);
router.delete("/api/ourteam/:id", deleteTeamMember);

// -----------------
// Dashboard Counts
router.get("/api/users/count", async (req, res) => {
  try {
    const count = await Registration.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/api/team/count", async (req, res) => {
  try {
    const count = await OurTeam.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Uncomment if Report model exists
// router.get("/api/reports/count", async (req, res) => {
//   try {
//     const count = await Report.countDocuments();
//     res.json({ count });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// -----------------
// Get all users
router.get("/api/users", async (req, res) => {
  try {
    const users = await Registration.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------
// ✅ Update user
router.put("/api/users/:id", async (req, res) => {
  try {
    const updatedUser = await Registration.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete user
router.delete("/api/users/:id", async (req, res) => {
  try {
    const deletedUser = await Registration.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------
// Facts Section API
router.get("/api/facts", async (req, res) => {
  try {
    // TODO: Agar MongoDB se lana ho to model bana ke query karna
    // Filhal static response bhej rahe hain
    res.json({
      students: 0,        // Students taught so far
      placements: 0,       // Total Placements
      topCompanies: 0,     // Students placed in Top IT Companies
      assistance: 0        // Placement Assistance
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

// Admin login controller
exports.adminLogin = async (req, res) => {
  try {
    const { userId, password } = req.body;

    // Check admin in DB
    const admin = await Admin.findOne({ userId });
    if (!admin) return res.status(400).json({ error: "Admin not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    // Login successful
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

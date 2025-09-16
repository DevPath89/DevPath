const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

// Admin login controller
exports.adminLogin = async (req, res) => {
  try {
    const { userId, password } = req.body;

    // 1️⃣ Check admin in DB
    const admin = await Admin.findOne({ userId });
    if (!admin) return res.status(400).json({ error: "Admin not found" });

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    // 3️⃣ Login successful — send role in response
    res.status(200).json({
      message: "Login successful",
      admin: {
        userId: admin.userId,
        role: admin.role,      // CEO / MD / Project Manager
        name: admin.name,      // optional, agar name store hai
      },
    });
  } catch (error) {
    console.error("❌ Admin login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

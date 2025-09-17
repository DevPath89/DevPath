const OurTeam = require("../models/OurTeam");
const path = require("path");
const fs = require("fs");

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ✅ Add Team Member
exports.addTeamMember = async (req, res) => {
  try {
    console.log("📥 Request body:", req.body);
    console.log("📥 Request files:", req.files);

    const { name, position } = req.body;

    if (!name || !position) {
      return res.status(400).json({ error: "Name and position are required" });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const imageFile = req.files.image;
    const imageName = Date.now() + path.extname(imageFile.name);
    const uploadPath = path.join(uploadsDir, imageName);

    // Save image to uploads folder
    await imageFile.mv(uploadPath);

    const member = new OurTeam({ name, position, image: imageName });
    await member.save();

    res.status(201).json({ message: "Team member added", member });
  } catch (err) {
    console.error("❌ Add Team Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// ✅ Get All Team Members
exports.getTeamMembers = async (req, res) => {
  try {
    const team = await OurTeam.find();
    res.status(200).json(team);
  } catch (err) {
    console.error("❌ Get Team Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// ✅ Update Team Member
exports.updateTeamMember = async (req, res) => {
  try {
    const { name, position } = req.body;
    const updateData = { name, position };

    if (req.files && req.files.image) {
      const imageFile = req.files.image;
      const imageName = Date.now() + path.extname(imageFile.name);
      const uploadPath = path.join(uploadsDir, imageName);
      await imageFile.mv(uploadPath);
      updateData.image = imageName;
    }

    const member = await OurTeam.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!member) return res.status(404).json({ error: "Member not found" });

    res.status(200).json({ message: "Team member updated", member });
  } catch (err) {
    console.error("❌ Update Team Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// ✅ Delete Team Member
exports.deleteTeamMember = async (req, res) => {
  try {
    const member = await OurTeam.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ error: "Member not found" });

    res.status(200).json({ message: "Team member deleted" });
  } catch (err) {
    console.error("❌ Delete Team Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

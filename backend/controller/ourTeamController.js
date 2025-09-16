const OurTeam = require("../models/OurTeam");
const path = require("path");

// ✅ Add Team Member
exports.addTeamMember = async (req, res) => {
  try {
    const { name, position } = req.body;

    if (!name || !position || !req.files || !req.files.image) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const imageFile = req.files.image;
    const imageName = Date.now() + path.extname(imageFile.name);
    const uploadPath = path.join(__dirname, "..", "uploads", imageName);

    // Save image to uploads folder
    await imageFile.mv(uploadPath);

    const newMember = new OurTeam({ name, position, image: imageName });
    await newMember.save();

    console.log("✅ Saved in DB:", newMember);

    res.status(201).json({
      message: "Team member added successfully",
      member: newMember,
    });
  } catch (err) {
    console.error("❌ Add Team Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get All Team Members
exports.getTeamMembers = async (req, res) => {
  try {
    const team = await OurTeam.find();
    res.status(200).json(team);
  } catch (err) {
    console.error("❌ Get Team Error:", err);
    res.status(500).json({ error: "Server error" });
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
      const uploadPath = path.join(__dirname, "..", "uploads", imageName);
      await imageFile.mv(uploadPath);
      updateData.image = imageName;
    }

    const member = await OurTeam.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!member) return res.status(404).json({ error: "Member not found" });

    res.status(200).json({ message: "Team member updated", member });
  } catch (err) {
    console.error("❌ Update Team Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Delete Team Member
exports.deleteTeamMember = async (req, res) => {
  try {
    const member = await OurTeam.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ error: "Member not found" });

    res.status(200).json({ message: "Team member deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Team Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

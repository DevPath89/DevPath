const OurTeam = require("../models/OurTeam");
const cloudinary = require("../config/cloudinary"); // Make sure you have this config file

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

    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(imageFile.tempFilePath, {
      folder: "team" // Optional folder name in Cloudinary
    });

    const member = new OurTeam({
      name,
      position,
      image: uploadedImage.secure_url, // Save Cloudinary URL
    });
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

      // Upload new image to Cloudinary
      const uploadedImage = await cloudinary.uploader.upload(imageFile.tempFilePath, {
        folder: "team"
      });
      updateData.image = uploadedImage.secure_url;
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

const OurTeam = require("../models/OurTeam");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ Add Team Member
exports.addTeamMember = async (req, res) => {
  try {
    const { name, position } = req.body;
    if (!name || !position)
      return res.status(400).json({ error: "Name and position are required" });
    if (!req.files || !req.files.image)
      return res.status(400).json({ error: "Image file is required" });

    const imageFile = req.files.image;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(imageFile.tempFilePath, {
      folder: "devpath/ourteam",
      use_filename: false,
      unique_filename: true
    });

    // Remove temp file
    try { fs.unlinkSync(imageFile.tempFilePath); } catch (e) {}

    const member = new OurTeam({
      name,
      position,
      image: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id
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
    const member = await OurTeam.findById(req.params.id);
    if (!member) return res.status(404).json({ error: "Member not found" });

    const { name, position } = req.body;
    if (name) member.name = name;
    if (position) member.position = position;

    // If new image provided
    if (req.files && req.files.image) {
      const imageFile = req.files.image;

      // Delete old image from Cloudinary
      if (member.imagePublicId) {
        try { await cloudinary.uploader.destroy(member.imagePublicId); } catch (e) {}
      }

      // Upload new image
      const uploadResult = await cloudinary.uploader.upload(imageFile.tempFilePath, {
        folder: "devpath/ourteam",
        use_filename: false,
        unique_filename: true
      });

      try { fs.unlinkSync(imageFile.tempFilePath); } catch (e) {}

      member.image = uploadResult.secure_url;
      member.imagePublicId = uploadResult.public_id;
    }

    await member.save();
    res.status(200).json({ message: "Team member updated", member });
  } catch (err) {
    console.error("❌ Update Team Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// ✅ Delete Team Member
exports.deleteTeamMember = async (req, res) => {
  try {
    const member = await OurTeam.findById(req.params.id);
    if (!member) return res.status(404).json({ error: "Member not found" });

    // Delete image from Cloudinary
    if (member.imagePublicId) {
      try { await cloudinary.uploader.destroy(member.imagePublicId); } catch (e) {}
    }

    await member.remove();
    res.status(200).json({ message: "Team member deleted" });
  } catch (err) {
    console.error("❌ Delete Team Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

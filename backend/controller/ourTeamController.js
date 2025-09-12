const OurTeam = require("../models/OurTeam");

// ✅ Add team member (already done)
exports.addTeamMember = async (req, res) => {
  try {
    const { name, position } = req.body;
    const image = req.file ? req.file.filename : null;
    if (!name || !position || !image) return res.status(400).json({ error: "All fields required" });

    const member = new OurTeam({ name, position, image });
    await member.save();

    res.status(201).json({ message: "Team member added", member });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get all team members
exports.getTeamMembers = async (req, res) => {
  try {
    const team = await OurTeam.find();
    res.status(200).json(team);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Update team member
exports.updateTeamMember = async (req, res) => {
  try {
    const { name, position } = req.body;
    const updateData = { name, position };

    if (req.file) updateData.image = req.file.filename;

    const member = await OurTeam.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!member) return res.status(404).json({ error: "Member not found" });

    res.status(200).json({ message: "Team member updated", member });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Delete team member
exports.deleteTeamMember = async (req, res) => {
  try {
    const member = await OurTeam.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ error: "Member not found" });

    res.status(200).json({ message: "Team member deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

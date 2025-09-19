const Lecture = require("../models/Lecture");

// 📌 Get all lectures
exports.getLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find().sort({ createdAt: -1 });
    res.json(lectures);
  } catch (err) {
    res.status(500).json({ error: "Error fetching lectures" });
  }
};

// 📌 Add new lecture
exports.addLecture = async (req, res) => {
  try {
    const { title, description, videoUrl } = req.body;
    const newLecture = new Lecture({ title, description, videoUrl });
    await newLecture.save();
    res.json(newLecture);
  } catch (err) {
    res.status(500).json({ error: "Error adding lecture" });
  }
};

// 📌 Update lecture
exports.updateLecture = async (req, res) => {
  try {
    const { title, description, videoUrl } = req.body;
    const updatedLecture = await Lecture.findByIdAndUpdate(
      req.params.id,
      { title, description, videoUrl },
      { new: true }
    );
    res.json(updatedLecture);
  } catch (err) {
    res.status(500).json({ error: "Error updating lecture" });
  }
};

// 📌 Delete lecture
exports.deleteLecture = async (req, res) => {
  try {
    await Lecture.findByIdAndDelete(req.params.id);
    res.json({ message: "Lecture deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting lecture" });
  }
};

// 📌 Upload video
exports.uploadVideo = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const videoUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  res.json({ videoUrl });
};

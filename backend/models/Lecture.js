const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String }, // YouTube URL or uploaded file ka URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lecture", lectureSchema);

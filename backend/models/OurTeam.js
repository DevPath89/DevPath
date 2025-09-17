const mongoose = require("mongoose");

const ourTeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    image: { type: String, required: true },          // Cloudinary secure_url
    imagePublicId: { type: String }                  // Cloudinary public_id (optional)
  },
  { timestamps: true }
);

module.exports = mongoose.model("OurTeam", ourTeamSchema);

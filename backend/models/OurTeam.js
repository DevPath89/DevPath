const mongoose = require("mongoose");

const ourTeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  image: { type: String, required: true } // URL from Cloudinary
});

module.exports = mongoose.model("OurTeam", ourTeamSchema);

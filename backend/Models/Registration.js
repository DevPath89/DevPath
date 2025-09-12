const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emailID: { type: String, required: true, unique: true },
  collegeName: { type: String, required: true },
  passingYear: { type: String, required: true },
  trainingType: { type: String, required: true },
  course: { type: String, required: true },
  mobileNo: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Registration", registrationSchema);

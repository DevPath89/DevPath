const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
require("dotenv").config();
const connectDB = require("../config/DB");

const createAdmin = async () => {
  await connectDB();

  const hashedPassword = await bcrypt.hash("admin@123", 10);

  const admin = new Admin({
    userId: "admin123",
    password: hashedPassword,
  });

  await admin.save();
  console.log("Admin created successfully");
  process.exit(0);
};

createAdmin();

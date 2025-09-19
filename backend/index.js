const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// DB Connection
const connectDB = require("./config/DB");

// Routes
const route = require("./routes/route");

const app = express();

// -----------------
// Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// -----------------
// Middleware
app.use(express.json()); // Parse JSON
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // frontend URL allow karo
    credentials: true,
  })
);
app.use(fileUpload());

// Serve static files for uploaded videos/images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -----------------
// Connect DB
connectDB();

// -----------------
// Routes
app.use("/", route);

// -----------------
// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// -----------------
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config();

// DB Connection
const connectDB = require("./config/DB");

// Routes
const route = require("./routes/route");

const app = express();

// -----------------
// Middleware
app.use(express.json()); // Parse JSON
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" })); // Cloudinary uploads

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

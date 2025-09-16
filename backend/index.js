const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");  // ✅ Add express-fileupload
const connectDB = require("./config/DB");
const route = require("./routes/route");
require("dotenv").config();

const app = express();

// -----------------
// Middleware
app.use(express.json());                // Parse JSON bodies
app.use(cors({ origin: "*" }));         // Hosting ke liye sab origins allow
app.use(fileUpload());                  // ✅ Enable express-fileupload

// Serve static files for uploaded images
app.use("/uploads", express.static("uploads"));

// -----------------
// Connect to MongoDB (Atlas ya Hosted DB)
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

const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const connectDB = require("./config/DB");
const route = require("./routes/route");
require("dotenv").config();

const app = express();

// -----------------
// Middleware
app.use(express.json()); // Parse JSON bodies

// ✅ CORS setup (allow only your frontend)
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ File upload middleware (Render ke liye /tmp use hoga)
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/", // Render supports /tmp
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max (optional)
  })
);

// ⚠️ Agar Cloudinary use karoge to local uploads folder ki zarurat nahi hogi
// Agar abhi local use karna ho to ye rakho:
app.use("/uploads", express.static("uploads"));

// -----------------
// Connect to MongoDB
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

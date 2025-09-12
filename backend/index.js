const express = require('express');
const cors = require('cors');        // ✅ Import cors
const connectDB = require('./config/DB');
const route = require('./routes/route');   // <-- yaha tumhara routes file import ho raha hai
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());             // Parse JSON bodies
app.use(cors());                     // ✅ Enable CORS for all origins

// Serve static files for team images
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
connectDB();

// Routes
app.use('/', route);                 // ✅ Sare routes yaha attach ho rahe hain

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blog");

app.get("/", (req, res) => {
  res.send("VoiceCast AI Podcast Backend is running. Use /api/auth or /api/blog for endpoints.");
});

app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running`);
});
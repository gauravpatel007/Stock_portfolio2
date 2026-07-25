const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const holdingRoutes = require("./routes/holdingRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const simpleWatchlistRoutes = require("./routes/simpleWatchlistRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Seed Admin User
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin", 10);
      await User.create({
        name: "Admin User",
        email: "admin",
        password: hashedPassword,
      });
      console.log("✅ Default admin user created (user: admin, pass: admin)");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
};
seedAdmin();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/holdings", holdingRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/simple-watchlist", simpleWatchlistRoutes);
app.use("/api/notifications", notificationRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Investment Portfolio API is Running 🚀",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
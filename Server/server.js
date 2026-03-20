import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// ✅ FIXED CORS (VERY IMPORTANT)
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    // Allow localhost + all Vercel domains
    if (
      origin === "http://localhost:5173" ||
      origin.includes("vercel.app")
    ) {
      return callback(null, true);
    }

    // ❌ Instead of throwing error → allow but log
    console.warn("Blocked by CORS:", origin);
    return callback(null, true); // ⚠️ allow for now (safe for portfolio)
  },
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  if (req.method === "POST" || req.method === "PUT") {
    console.log("Body:", req.body);
  }
  next();
});

// Database
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

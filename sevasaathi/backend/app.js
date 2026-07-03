const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const { errorHandler, notFound } = require("./middleware/errorMiddleware");

// Route imports
const authRoutes = require("./routes/authRoutes");
const providerRoutes = require("./routes/providerRoutes");

const app = express();

// Core middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS policy does not allow access from ${origin}`));
    },
    credentials: true,
  })
);

// Static folder for uploaded files (profile images, provider docs, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root route
app.get("/", (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "Welcome to SevaSaathi API",
    version: "1.0.0"
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "SevaSaathi API is running" });
});

// Mounted API routes
app.use("/api/auth", authRoutes);
app.use("/api/providers", providerRoutes);
const bookingRoutes = require("./routes/bookingRoutes");
app.use("/api/bookings", bookingRoutes);
// Future phases will mount here, e.g.:
// app.use("/api/users", userRoutes);
// app.use("/api/providers", providerRoutes);

// 404 + error handling (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;

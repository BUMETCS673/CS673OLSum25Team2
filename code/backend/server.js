require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const storyRoutes = require("./routes/story");
const settingRoutes = require("./routes/setting");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

// express app
const app = express();

// listen for requests
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
// Allow specific origin for CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://velvety-entremet-8ac832.netlify.app",
    ],
    credentials: true,
  })
);
app.use(helmet()); // Security headers

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
});
app.use("/api/", limiter);

// routes
app.use("/api/user", userRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/settings", settingRoutes);

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});


// connect to mongodb
mongoose
  .connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`🌙 Bedtime Story Server running on port ${port}`);
      console.log(`📚 Health check: http://localhost:${port}/health`);
      // console.log(`🎨 API base URL: http://localhost:${port}/api`);
    });

    console.log("Connected to MongoDB");

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.warn(
        "⚠️  WARNING: OPENAI_API_KEY not found in environment variables"
      );
    } else {
      console.log("✅ OpenAI API key configured");
    }
  })
  .catch((err) => {
    console.log(err);
  });
module.exports = app;


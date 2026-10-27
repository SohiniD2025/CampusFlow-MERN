require("node:dns").setServers(["8.8.8.8", "1.1.1.1"]);
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./src/routes/authRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const { notFound, errorHandler } = require("./src/middleware/errorMiddleware");

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://campus-flow-mern.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => res.json({ status: "ok", app: "CampusFlow API" }));
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });

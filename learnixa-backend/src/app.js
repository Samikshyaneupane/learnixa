const fs = require("fs");
const path = require("path");

// Manually load .env
const envPath = path.join(__dirname, ".env");
const envContent = fs.readFileSync(envPath, "utf8");
envContent.split("\n").forEach((line) => {
  const [key, value] = line.split("=");
  if (key && value !== undefined) {
    process.env[key.trim()] = value.trim();
  }
});

const express = require("express");
const cors = require("cors");

require("./config/db");

const goalRoutes = require("./routes/goalRoutes");
const authRoutes = require("./routes/authRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const courseRoutes = require("./routes/courseRoutes");
const questionRoutes = require("./routes/questionRoutes");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/goals", goalRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/questions", questionRoutes);


app.get("/", (req, res) => {
  res.send("Learnixa backend is running");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/adminController");
const verifyAdmin = require("../middleware/adminMiddleware");

router.get("/stats", verifyAdmin, getDashboardStats);

module.exports = router;
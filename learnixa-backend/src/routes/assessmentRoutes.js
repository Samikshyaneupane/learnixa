const express = require("express");
const router = express.Router();
const { saveAssessment, getHistory } = require("../controllers/assessmentController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/save", verifyToken, saveAssessment);
router.get("/history/:user_id", verifyToken, getHistory);

module.exports = router;
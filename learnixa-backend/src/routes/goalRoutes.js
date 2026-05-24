const express = require("express");
const router = express.Router();
const { getGoals } = require("../controllers/goalController");

router.get("/", getGoals);

module.exports = router;
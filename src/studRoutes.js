const express = require("express");
const path = require("path");
const { requireAuth } = require("./middlewares/authController");

const router = express.Router();

router.use(requireAuth("Student"));

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "app/stud/dashboard.html"));
});

module.exports = router;

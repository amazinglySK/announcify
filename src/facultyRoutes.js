const express = require("express");
const path = require("path");
const router = express.Router();
const { requireAuth } = require("./middlewares/authController");
const frontEndGroupsRouter = require("./frontendGroupsRoute");

router.use(requireAuth("Teacher"));
router.use("/groups", frontEndGroupsRouter);

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "app/faculty/dashboard.html"));
});

router.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "app/faculty/admin.html"));
});

router.get("/new", (req, res) => {
  res.sendFile(path.join(__dirname, "app/faculty/new.html"));
});

module.exports = router;

const path = require("path");
const express = require("express");
const router = express.Router();

router.get("/:gid", (req, res) => {
  res.sendFile(path.join(__dirname, "/app/faculty/groups/group.html"));
});

router.get("/:gid/new", (req, res) => {
  res.sendFile(path.join(__dirname, "/app/faculty/groups/new.html"));
});

module.exports = router;

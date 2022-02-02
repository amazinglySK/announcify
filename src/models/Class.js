const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  grade: { type: String, required: true },
  section: { type: String, required: true },
  class_name: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teachers" },
  announcements: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Announcement" },
  ],
});

module.exports = mongoose.model("Class", classSchema);

const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  members: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }],
    default: [],
  },
  group_id: {
    type: String,
    default: nanoid(8),
  },
  announcements: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Announcement" }],
    default: [],
  },
});

module.exports = mongoose.model("Group", GroupSchema);

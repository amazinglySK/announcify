const mongoose = require("mongoose");
const User = require("./User");

const TeacherSchema = new mongoose.Schema({
  school_id: String,
  groups: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
    default: [],
  },
});

const Teachers = User.discriminator("Teacher", TeacherSchema, {
  discriminatorKey: "_type",
});

module.exports = Teachers;

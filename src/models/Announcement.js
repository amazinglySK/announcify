const mongoose = require("mongoose");
const { isURL } = require("validator");
const { nanoid } = require("nanoid");

const announcementSchema = mongoose.Schema({
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "Teachers" },
  dateOfPost: { type: Date, default: Date.now },
  dueDate: { type: Date, require: false },
  completed_students: {
    type: [
      {
        student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Students" },
        time: { type: Date },
      },
    ],
    default: [],
  },
  title: String,
  description: String,
  content: String,
  links: [
    {
      type: String,
      validate: [isURL, "Given url is not a right url"],
    },
  ],
  uid: {
    type: String,
    default: nanoid(8),
  },
});

module.exports = mongoose.model("Announcements", announcementSchema);

const mongoose = require("mongoose");
const User = require("./User");

const StudentSchema = new mongoose.Schema({
  school_id: String,
});

const Students = User.discriminator("Student", StudentSchema, {
  discriminatorKey: "_type",
});

module.exports = Students;

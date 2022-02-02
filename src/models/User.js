const mongoose = require("mongoose");
const { isEmail } = require("validator");

const UserSchema = new mongoose.Schema(
  {
    official_name: String,
    username: String,
    password: String,
    email: { type: String, validate: [isEmail, "Not a right email "] },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: false,
    },
  },
  {
    collection: "users",
    discriminatorKey: "_type",
  }
);

module.exports = mongoose.model("Users", UserSchema);

const mongoose = require("mongoose");
require("dotenv").config();

const mongoConn = () => {
  mongoose.connect(process.env.MONGODB_URI);
  console.log("Done connecting to the database");
};

module.exports = { mongoConn };

const mongoose = require("mongoose");
require("dotenv").config();

const mongoConn = () => {
  mongoose.connect(process.env.MONGODB_URI);
};

module.exports = { mongoConn };

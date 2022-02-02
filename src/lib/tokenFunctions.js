const jwt = require("jsonwebtoken");
require("dotenv").config();

const createToken = (id, role, class_id) => {
  console.log(class_id);
  const secret = process.env.JWT_SECRET;
  const maxAge = 12 * 60 * 60; // 1/2 days in seconds
  return jwt.sign({ id, role, class_id }, secret, {
    expiresIn: maxAge,
  });
};

const decodeToken = (token, requiredData) => {
  const secret = process.env.JWT_SECRET;
  let decodedData = jwt.verify(token, secret);
  return decodedData[requiredData];
};
module.exports = { createToken, decodeToken };

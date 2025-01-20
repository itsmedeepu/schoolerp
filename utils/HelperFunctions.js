const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const genrateUniqueId = () => {
  return uuidv4();
};

const genrateToken = (payload) => {
  const token = jwt.sign(
    JSON.stringify(payload),
    process.env.TEACHER_PRIVATE_KEY
  );

  return token;
};

module.exports = { genrateUniqueId, genrateToken };

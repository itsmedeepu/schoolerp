const TeacherModel = require("../models/TeacherModel");
const { ValidationError } = require("../utils/Errors");
const jwt = require("jsonwebtoken");

const TeacherAuth = async (req, res, next) => {
  const headers = req.headers.authorization;
  const acessToken = headers && headers.split(" ")[1];
  if (!acessToken) {
    throw new ValidationError(401, "access token not found ");
  }
  //const verifytoken = jwt.verify(acessToken, process.env.TEACHER_PRIVATE_KEY);
  jwt.verify(
    acessToken,
    process.env.TEACHER_PRIVATE_KEY,
    function (err, decoded) {
      if (err) {
        throw new ValidationError(401, "access token expired or invalid");
      }
    }
  );

  next();
};

const StudentAuth = async (req, res, next) => {
  const headers = req.headers.authorization;
  const acessToken = headers && headers.split(" ")[1];
  if (!acessToken) {
    throw new ValidationError(401, "access token not found ");
  }
  //const verifytoken = jwt.verify(acessToken, process.env.TEACHER_PRIVATE_KEY);
  jwt.verify(
    acessToken,
    process.env.STUDENT_PRIVATE_KEY,
    function (err, decoded) {
      if (err) {
        throw new ValidationError(401, "access token expired or invalid");
      }
    }
  );

  next();
};

const AdminAuth = async (req, res, next) => {
  const headers = req.headers.authorization;
  const acessToken = headers && headers.split(" ")[1];
  if (!acessToken) {
    throw new ValidationError(401, "access token not found ");
  }

  jwt.verify(
    acessToken,
    process.env.ADMIN_PRIVATE_KEY,
    function (err, decoded) {
      if (err) {
        throw new ValidationError(401, "access token expired or invalid");
      }
    }
  );
};

module.exports = { TeacherAuth, StudentAuth, AdminAuth };

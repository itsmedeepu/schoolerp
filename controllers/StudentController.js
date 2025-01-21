const StudentModel = require("../models/StudentModel");
const bcrypt = require("bcrypt");
const { ValidationError, NotFoundError } = require("../utils/Errors");
const {
  isValidText,
  genrateUniqueId,
  genrateToken,
} = require("../utils/HelperFunctions");

const RegisterStudent = async (req, res) => {
  const { email, password, name, classs, address, phone } = req.body;

  if (
    !isValidText(email) ||
    !isValidText(password) ||
    !isValidText(name) ||
    !isValidText(phone) ||
    !isValidText(address)
  ) {
    throw new ValidationError(500, "all feilds are required");
  }
  const uniqueStudentId = genrateUniqueId();
  const hashedpassword = await bcrypt.hash(password, 10);

  const student = new StudentModel({
    email,
    password: hashedpassword,
    name,
    classs,
    phone,
    address,
    uniqueStudentId,
  });
  const saveStudent = await student.save();
  return res
    .status(201)
    .json({ message: "student registred sucessfully", data: saveStudent });
};

const UpdateStudentDetails = async (req, res) => {
  const { email, name, classs, address, uniqueStudentId, phone } = req.body;

  if (!isValidText(uniqueStudentId)) {
    throw new ValidationError(500, "unique student id required");
  }

  const updateStudent = await StudentModel.findOneAndUpdate(
    { uniqueStudentId },
    { $set: { email, name, phone, email, classs, address } },
    { new: true }
  );

  return res
    .status(200)
    .json({ message: "student updated sucessfully", data: { updateStudent } });
};

const StudentLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!isValidText(email) || !isValidText(password)) {
    throw new ValidationError(500, "all feilds are required");
  }

  const getStudent = await StudentModel.findOne({ email });
  if (!getStudent) {
    throw new NotFoundError(500, "student not found with this email id");
  }
  const checkpassword = await bcrypt.compare(password, getStudent.password);
  if (!checkpassword) {
    throw new NotFoundError(401, "invalid login details");
  }
  const token = genrateToken(getStudent.uniqueStudentId, "student");
  return res
    .status(200)
    .json({ message: "user login sucessfull", data: { token } });
};

const GetStudents = async (req, res) => {
  const students = await StudentModel.find({}, { password: 0 });
  res
    .status(200)
    .json({ message: "students fetched sucessfully", data: { students } });
};

const GetStudentsByClass = async (req, res) => {
  const { classid } = req.query;
  if (!classid) {
    throw new ValidationError(500, "invalid details");
  }
  const students = await StudentModel.find(
    { classs: classid },
    { password: 0 }
  );
  res
    .status(200)
    .json({ message: "students fetched sucessfully", data: { students } });
};

const GetStudentsByUniqueId = async (req, res) => {
  const studentuniqueId = req.params.studentuniqueId;
  if (!studentuniqueId) {
    throw new ValidationError(500, "enter correct student id");
  }
  const student = await StudentModel.findOne(
    { uniqueStudentId: studentuniqueId },
    { password: 0 }
  );
  if (!student) {
    throw new NotFoundError(500, "student not found with this id");
  }
  res
    .status(200)
    .json({ message: "student fetched sucessfully", data: { student } });
};

const resetPasswordStudent = async (req, res) => {
  const { email, password } = req.body;
  if (!isValidText(email) || !isValidText(password)) {
    throw new ValidationError(500, "all feilds are required");
  }
  const findStudent = await StudentModel.findOne({ email });
  if (!findStudent) {
    throw new NotFoundError(500, "no student found with this email");
  }

  const hashedpassword = await bcrypt.hash(password, 10);

  const updatePassword = await StudentModel.updateOne(
    { email },
    { $set: { password: hashedpassword } }
  );

  return res
    .status(201)
    .json({ message: "student password reset sucessfully" });
};

module.exports = {
  RegisterStudent,
  StudentLogin,
  GetStudents,
  GetStudentsByClass,
  GetStudentsByUniqueId,
  UpdateStudentDetails,
  resetPasswordStudent,
};

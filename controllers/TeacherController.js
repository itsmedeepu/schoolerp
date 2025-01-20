const TeacherModel = require("../models/TeacherModel");
const {
  NotFoundError,
  DuplicateError,
  ValidationError,
} = require("../utils/Errors");
const { genrateUniqueId, genrateToken } = require("../utils/HelperFunctions");
const bcrypt = require("bcrypt");

const Login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || email.trim() === "") {
    throw new ValidationError(500, "email is required");
  }
  if (!password || password.trim() === "") {
    throw new ValidationError(500, "password is required");
  }

  const findTeacher = await TeacherModel.findOne({ email });
  if (!email) {
    throw new ValidationError(500, "invalid details");
  }
  const checkPassword = await bcrypt.compare(password, findTeacher.password);
  if (!checkPassword) {
    throw ValidationError(500, "invalid credentials");
  }

  const token = genrateToken(findTeacher.uniqueTeacherId);
  return res.status(200).json({ message: "login sucessfull", data: { token } });
};

const RegisterTeacher = async (req, res) => {
  const { name, email, phone, address, password } = req.body;
  if (!name || !email || !phone || !address || !password) {
    throw new ValidationError(500, "one or more feilds required");
  }

  const findteacher = await TeacherModel.findOne({
    $or: [{ email: email }, { phone: phone }],
  });
  if (findteacher) {
    throw new DuplicateError(500, "teacher already exists with this details");
  }
  //generate new uuuid
  const uniqueTeacherId = genrateUniqueId();

  const hashedpassword = await bcrypt.hash(password, 10);
  const teacher = new TeacherModel({
    name,
    email,
    phone,
    address,
    password: hashedpassword,
    uniqueTeacherId,
  });

  const saveteacher = await teacher.save();
  return res.status(201).json({ message: "teacher registred sucessfully" });
};

const GetAllTeachers = async (req, res) => {
  const allteachers = await TeacherModel.find({}, { password: 0 });
  return res
    .status(200)
    .json({ message: "teachers fetched sucessfully", data: allteachers });
};

const GetTeacherById = async (req, res) => {
  const teacherid = req.params.teacheruuid;
  const teacher = await TeacherModel.find(
    { uniqueTeacherId: teacherid },
    { password: 0 }
  );
  if (!teacher) {
    throw new NotFoundError(500, "teacher not found with this id");
  }
  return res
    .status(200)
    .json({ message: "teacher fetched sucessfully", data: teacher });
};

const updateTeacher = async (req, res) => {
  const {
    uniqueTeacherId,
    name,
    email,
    password,
    phone,
    photo,
    classes,
    address,
  } = req.body;

  // Check if the teacher exists
  const fetchteacher = await TeacherModel.findOne({ uniqueTeacherId });
  if (!fetchteacher) {
    throw new NotFoundError(404, "Teacher not found with this ID");
  }

  // Update fields
  let updatedFields = { name, email, phone, photo, classes, address };

  if (password && password.trim() !== "") {
    updatedFields.password = await bcrypt.hash(password, 10);
  }

  // Update the teacher in the database
  const updateteacher = await TeacherModel.findOneAndUpdate(
    { uniqueTeacherId },
    updatedFields,
    { new: true },
    {
      password: 0,
    }
  );

  return res.status(200).json({
    message: "Teacher updated successfully",
    data: updateteacher,
  });
};

const resetPassword = async (req, res) => {
  const teacheruuid = req.body.teacheruuid;

  if (!teacheruuid) {
    throw new ValidationError(500, "invalid details");
  }
  const findteacher = await TeacherModel.findOne({
    uniqueTeacherId: teacheruuid,
  });
  if (!findteacher) {
    throw new ValidationError(500, "invalid details");
  }

  if (req.body.password != " ") {
    const hashedpassword = await bcrypt.hash(req.body.password, 10);
    findteacher.password = hashedpassword;
  }

  const updateTeacher = await TeacherModel.updateOne(
    { uniqueTeacherId: teacheruuid },
    { $set: { password: findteacher.password } },
    { new: true }
  );

  return res.status(201).json({ message: "password reset sucessfully" });
};

module.exports = {
  RegisterTeacher,
  GetAllTeachers,
  GetTeacherById,
  updateTeacher,
  resetPassword,
  Login,
};

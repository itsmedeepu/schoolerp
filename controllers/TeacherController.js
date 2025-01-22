const TeacherModel = require("../models/TeacherModel");
const {
  NotFoundError,
  DuplicateError,
  ValidationError,
} = require("../utils/Errors");
const {
  genrateUniqueId,
  genrateToken,
  sendEmail,
  isValidText,
} = require("../utils/HelperFunctions");
const bcrypt = require("bcrypt");

const Login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || email.trim() === "") {
    throw new ValidationError(400, "email is required");
  }
  if (!password || password.trim() === "") {
    throw new ValidationError(400, "password is required");
  }

  const findTeacher = await TeacherModel.findOne({ email });
  if (!email) {
    throw new ValidationError(400, "invalid details");
  }
  const checkPassword = await bcrypt.compare(password, findTeacher.password);
  if (!checkPassword) {
    throw ValidationError(401, "invalid credentials");
  }

  const accesstoken = genrateToken(
    findTeacher.uniqueTeacherId,
    "teacher",
    "5m"
  );
  const refreshtoken = genrateToken(
    findTeacher.uniqueTeacherId,
    "teacher",
    "1d"
  );
  return res
    .status(200)
    .json({ message: "login sucessfull", data: { accesstoken, refreshtoken } });
};

const RegisterTeacher = async (req, res) => {
  const { name, email, phone, address, password, classes } = req.body;
  if (!name || !email || !phone || !address || !password) {
    throw new ValidationError(400, "one or more feilds required");
  }

  const findteacher = await TeacherModel.findOne({
    $or: [{ email: email }, { phone: phone }],
  });
  if (findteacher) {
    throw new DuplicateError(409, "teacher already exists with this details");
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
  if (classes.length > 0) {
    teacher.classes = [...classes];
  }

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
    throw new NotFoundError(404, "teacher not found with this id");
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
    throw new ValidationError(400, "teacher id is required to reset password");
  }
  const findteacher = await TeacherModel.findOne({
    uniqueTeacherId: teacheruuid,
  });
  if (!findteacher) {
    throw new ValidationError(404, "teacher not found");
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

//otp reset password

const ResetPasswordviaLink = async (req, res) => {
  //sendmail to the requested user mail id
  const { email } = req.body;
  if (!email || email.trim() == "") {
    throw new ValidationError(400, "email is requried");
  }

  const findTeacherByEmail = await TeacherModel.findOne({ email });
  if (!findTeacherByEmail) {
    throw new NotFoundError(404, "no user found with this id");
  }
  const token = genrateToken(findTeacher.uniqueTeacherId, "teacher", "3h");

  //send password reset link here

  const data = {
    senderEmail: findTeacherByEmail.email,
    token,
  };

  sendEmail(data);

  return res
    .status(200)
    .json({ message: "password reset link sent to email id" });
  //configure the link here
};

const GetTeacherByClass = async (req, res) => {
  const classid = req.params.classid;
  console.log(classid);
  if (!classid) {
    throw new ValidationError(400, "class id is mandatory");
  }

  const teachers = await TeacherModel.find(
    { classes: classid },
    { password: 0 }
  );

  if (!teachers) {
    throw new NotFoundError(404, "no teachers present in this class");
  }

  return res
    .status(200)
    .json({ message: "teachers fetched sucessfully", data: { teachers } });
};

const MapTeacherToClass = async (req, res) => {
  const { teacheruuid, classes } = req.body;
  if (!classes || classes.length <= 0)
    throw new ValidationError(400, "please provide class id");

  const updateclasses = await TeacherModel.updateOne(
    { uniqueTeacherId: teacheruuid },
    { $addToSet: { classes: { $each: classes } } },
    { new: true }
  );

  return res
    .status(201)
    .json({ message: "classes mapped sucessfully", data: updateclasses });
};

const GetClassesByTeachersId = async (req, res) => {
  const teacheruuid = req.params.teacheruuid;
  if (!teacheruuid || !isValidText(teacheruuid)) {
    throw new ValidationError(400, "teacher id required");
  }
  const getclasses = await TeacherModel.findOne(
    {
      uniqueTeacherId: teacheruuid,
    },
    { classes: 1, _id: 0 }
  ).populate("classes");

  if (!getclasses) {
    throw new NotFoundError(500, "no classes assigned to this teacher");
  }

  return res.status(200).json({
    message: "classes featched sucessfully",
    data: getclasses,
  });
};

module.exports = {
  RegisterTeacher,
  GetAllTeachers,
  GetTeacherById,
  updateTeacher,
  resetPassword,
  Login,
  ResetPasswordviaLink,
  GetTeacherByClass,
  GetClassesByTeachersId,
  MapTeacherToClass,
};

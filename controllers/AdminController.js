const AdminModel = require("../models/AdminModel");
const {
  ValidationError,
  DuplicateError,
  NotFoundError,
} = require("../utils/Errors");
const {
  isValidText,
  genrateUniqueId,
  genrateToken,
} = require("../utils/HelperFunctions");
const bcrypt = require("bcrypt");

const Register = async (request, response) => {
  const { email, phone, name, address, password } = request.body;
  if (!isValidText(email) || !isValidText(phone)) {
    throw new ValidationError(401, "all feilds are required");
  }
  const checkifAdminAlready = await AdminModel.findOne({ email, phone });
  if (checkifAdminAlready) {
    throw new DuplicateError(409, "already admin present with this id");
  }
  const uniqueAdminId = genrateUniqueId();
  const hashedpassword = await bcrypt.hash(password, 10);
  const admin = new AdminModel({
    name,
    email,
    phone,
    address,
    password: hashedpassword,
    uniqueAdminId,
  });
  const saveAdmin = await admin.save();
  return response.status(201).json({ message: "admin registred sucessfully" });
};

const AdminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!isValidText(email) || !isValidText(password)) {
    throw new ValidationError(401, "all feilds are required");
  }

  const findadmin = await AdminModel.findOne({ email });
  if (!findadmin) {
    throw new NotFoundError(404, "no admin found with this id");
  }
  const checkpassword = await bcrypt.compare(password, findadmin.password);
  if (!checkpassword) {
    throw new NotFoundError(404, "invalid login details");
  }
  //genrate acess token

  const accesstoken = genrateToken(findadmin.uniqueAdminId, "admin", "5m");
  const refreshtoken = genrateToken(findadmin.uniqueAdminId, "admin", "1d");

  return res
    .status(200)
    .json({ message: "login sucessfull", data: { accesstoken, refreshtoken } });
};

module.exports = { Register, AdminLogin };

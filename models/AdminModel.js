const mongoose = require("mongoose");

const AdminSchema = mongoose.Schema({
  uniqueAdminId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["admin", "teacher", "student"],
    default: "admin",
  },
});

const AdminModel = mongoose.model("Admin", AdminSchema);
module.exports = AdminModel;

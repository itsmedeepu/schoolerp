const mongoose = require("mongoose");

const StudentSchema = mongoose.Schema({
  uniqueStudentId: {
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
  },
  classs: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
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
});

const StudentModel = mongoose.model("Student", StudentSchema);
module.exports = StudentModel;

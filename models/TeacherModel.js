const mongoose = require("mongoose");

const TeacherSchema = mongoose.Schema({
  uniqueTeacherId: {
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
  classes: {
    type: [mongoose.Types.ObjectId],
    ref: "Class",
    default: [],
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
    default: "teacher",
  },
});

const TeacherModel = mongoose.model("Teacher", TeacherSchema);
module.exports = TeacherModel;

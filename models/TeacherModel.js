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
});

const TeacherModel = mongoose.model("Teacher", TeacherSchema);
module.exports = TeacherModel;

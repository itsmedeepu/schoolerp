const mongoose = require("mongoose");

const AttendanceSchema = mongoose.Schema({
  classid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  students: [
    {
      studentid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      status: {
        type: String,
        enum: ["P", "A"],
        required: true,
      },
      remarks: {
        type: String,
      },
    },
  ],
  teacherid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
});

const AttendanceModel = mongoose.model("Attendance", AttendanceSchema);
module.exports = AttendanceModel;

const mongoose = require(".mongoose");

const AttendanceSchema = mongoose.Schema({
  class: {
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
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ["Present", "Absent", "Late", "Excused"],
        required: true,
      },
      remarks: {
        type: String,
      },
    },
  ],
  teacher: {
    type: mongoose.Schema.Types.ObjectId, // Reference to a Teacher model (if exists)
    ref: "Teacher",
    required: true,
  },
});

const AttendanceModel = mongoose.model("Attendance", AttendanceSchema);
module.exports = AttendanceModel;

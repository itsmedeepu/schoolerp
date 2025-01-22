const AttendanceModel = require("../models/AttendenceModel");
const { ValidationError } = require("../utils/Errors");
const { isValidText } = require("../utils/HelperFunctions");

const markAttendence = async (req, res) => {
  const { teacherid, students, classid } = req.body;

  if (!isValidText(teacherid) || students.length < 0 || !isValidText(classid)) {
    throw new ValidationError(500, "all details required to mark attendence");
  }
  const markAttendence = new AttendanceModel({
    classid,
    students,
    teacherid,
  });

  const saveAttendence = await markAttendence.save();

  return res.status(201).json({
    message: "attendence marked sucessfully",
    data: saveAttendence,
  });
};
const GetAttendenceByClass = async (req, res, next) => {
  const { classid } = req.params;

  // Validate the class ID
  if (!isValidText(classid)) {
    throw new ValidationError(400, "Class ID is required");
  }

  // Fetch attendance records for the given class ID
  const attendances = await AttendanceModel.find({ classid });

  if (!attendances || attendances.length === 0) {
    return res.status(404).json({
      message: "No attendance records found for the specified class",
    });
  }

  return res.status(200).json({
    message: "Attendance records fetched successfully",
    data: attendances,
  });
};

// Function to get attendance by date
const GetAttendanceByDate = async (req, res, next) => {
  const { classid, date } = req.query; // Expecting classid and date in query parameters

  // Validate the inputs
  if (!classid || !date) {
    throw new ValidationError(400, "Class ID and date are required");
  }

  // Parse the date and ensure it is valid
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new ValidationError(400, "Invalid date format");
  }

  // Fetch attendance records for the given class ID and date
  const attendances = await AttendanceModel.find({
    classid,
    date: {
      $gte: new Date(parsedDate.setHours(0, 0, 0, 0)), // Start of the day
      $lte: new Date(parsedDate.setHours(23, 59, 59, 999)), // End of the day
    },
  });
  if (!attendances || attendances.length === 0) {
    return res.status(404).json({
      message: "No attendance records found for the specified class and date",
    });
  }

  return res.status(200).json({
    message: "Attendance records fetched successfully",
    data: attendances,
  });
};

module.exports = { GetAttendanceByDate };

module.exports = { markAttendence, GetAttendenceByClass, GetAttendanceByDate };

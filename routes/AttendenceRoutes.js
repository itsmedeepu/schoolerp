const express = require("express");
const {
  markAttendence,
  GetAttendenceByClass,
  GetAttendanceByDate,
} = require("../controllers/AttendeceController");
const router = express.Router();

router.post("/markattendence", markAttendence);
router.get("/getattendencebyclass/:classid", GetAttendenceByClass);
router.get("/getattendencebydate", GetAttendanceByDate);
module.exports = router;

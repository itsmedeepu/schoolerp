const express = require("express");
const {
  RegisterStudent,
  StudentLogin,
  GetStudents,
  GetStudentsByClass,
  GetStudentsByUniqueId,
  UpdateStudentDetails,
  resetPasswordStudent,
} = require("../controllers/StudentController");
const { StudentAuth, TeacherAuth } = require("../middleware/Auth");
const router = express.Router();

router.post("/register", RegisterStudent);
router.post("/login", StudentLogin);
router.get("/getstudents", [TeacherAuth], GetStudents);
router.get("/getstudentbyclass", [TeacherAuth], GetStudentsByClass);
router.get(
  "/getstudentbyuid/:studentuniqueId",
  [StudentAuth],
  GetStudentsByUniqueId
);
router.patch("/updatestudent", [StudentAuth], UpdateStudentDetails);
router.patch("/resetpassword", resetPasswordStudent);
module.exports = router;

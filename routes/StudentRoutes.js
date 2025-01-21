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
const router = express.Router();

router.post("/register", RegisterStudent);
router.post("/login", StudentLogin);
router.get("/getstudents", GetStudents);
router.get("/getstudentbyclass", GetStudentsByClass);
router.get("/getstudentbyuid/:studentuniqueId", GetStudentsByUniqueId);
router.patch("/updatestudent", UpdateStudentDetails);
router.patch("/resetpassword", resetPasswordStudent);
module.exports = router;

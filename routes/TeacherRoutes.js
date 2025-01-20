const express = require("express");
const router = express.Router();
const {
  RegisterTeacher,
  GetAllTeachers,
  GetTeacherById,
  updateTeacher,
  resetPassword,
  Login,
} = require("../controllers/TeacherController");

// router.get("/getclasses", GetClass);
router.post("/addteacher", RegisterTeacher);
router.get("/getallteachers", GetAllTeachers);
router.get("/getteacherbyid/:teacheruuid", GetTeacherById);
router.patch("/updateteacher", updateTeacher);
router.post("/resetpassword", resetPassword);
router.post("/login", Login);

// router.get("/getclassbyid/:classid", GetClassById);
// router.delete("/deleteclass/:classid", DeleteClass);

module.exports = router;

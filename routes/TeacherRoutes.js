const express = require("express");
const router = express.Router();
const {
  RegisterTeacher,
  GetAllTeachers,
  GetTeacherById,
  updateTeacher,
  resetPassword,
  Login,
  ResetPasswordviaLink,
  GetTeacherByClass,
  GetClassesByTeachersId,
  MapTeacherToClass,
} = require("../controllers/TeacherController");

// router.get("/getclasses", GetClass);
router.post("/addteacher", RegisterTeacher);
router.get("/getallteachers", GetAllTeachers);
router.get("/getteacherbyid/:teacheruuid", GetTeacherById);
router.patch("/updateteacher", updateTeacher);
router.post("/resetpassword", resetPassword);
router.post("/login", Login);
router.post("/resetpassvialink", ResetPasswordviaLink);
router.get("/getteacherbyclass/:classid", GetTeacherByClass);
router.get("/getclassesbyteacher/:teacheruuid", GetClassesByTeachersId);
router.patch("/mapteachertoclass", MapTeacherToClass);

// router.get("/getclassbyid/:classid", GetClassById);
// router.delete("/deleteclass/:classid", DeleteClass);

module.exports = router;

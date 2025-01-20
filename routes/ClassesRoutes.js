const express = require("express");
const router = express.Router();
const {
  GetClass,
  AddClass,
  DeleteClass,
  GetClassById,
} = require("../controllers/ClassController");

router.get("/getclasses", GetClass);
router.post("/addclass", AddClass);
router.get("/getclassbyid/:classid", GetClassById);
router.delete("/deleteclass/:classid", DeleteClass);

module.exports = router;

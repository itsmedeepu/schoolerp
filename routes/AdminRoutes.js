const express = require("express");
const { Register, AdminLogin } = require("../controllers/AdminController");
const router = express.Router();

router.post("/register", Register);
router.post("/login", AdminLogin);

module.exports = router;

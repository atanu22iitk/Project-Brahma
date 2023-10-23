const express = require("express");
const router = express.Router();
const DoctorAuthController = require("./Contollers");

router.post("/login", DoctorAuthController.doctorLogin);
router.post("/change/Password", DoctorAuthController.doctorUpdatePassword);

module.exports = router;

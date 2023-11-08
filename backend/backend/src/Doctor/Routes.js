const express = require("express");
const router = express.Router();
const DoctorController = require("./Controller");

router.post("/register", DoctorController.registerDoctor);
router.post("/update", DoctorController.updateDoctor);
router.post("/delete", DoctorController.deleteDoctor);

module.exports = router;

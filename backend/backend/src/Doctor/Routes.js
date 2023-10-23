const express = require("express");
const router = express.Router();
const DoctorController = require("./Controller");

router.post("/register", DoctorController.registerDoctor);

module.exports = router;

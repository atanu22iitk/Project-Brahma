const express = require('express');
const router = express.Router();
const DoctorAuthController = require("./Contollers");

router.post('/login', DoctorAuthController.doctorLogin);

module.exports = router;
const express = require("express");
const router = express.Router();
const UserAuthController = require("./Contollers");

router.post("/login", UserAuthController.login);
router.post("/login/verify", UserAuthController.verifyLogin);
router.post("/password/update", UserAuthController.updatePassword);

module.exports = router;

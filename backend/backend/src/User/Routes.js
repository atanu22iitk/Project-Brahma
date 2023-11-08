const express = require("express");
const router = express.Router();
const UserController = require("./Controller");

router.post("/getAllUser", UserController.getAllUsers);
router.post("/getUserById", UserController.getUserById);
router.post("/getUserByType", UserController.getUsersByType);
router.post("/getAllRegistrationId", UserController.getAllRegistrationIds);
router.post("/approve", UserController.approveUser);

module.exports = router;

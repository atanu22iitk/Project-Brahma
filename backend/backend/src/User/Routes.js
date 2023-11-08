const express = require("express");
const router = express.Router();
const UserController = require("./Controller");

router.post("/getAllUser", UserController.getAllUsers);
router.post("/getUserById", UserController.getUserById);
router.post("/getUserByType", UserController.getUsersByType);
router.post("/getAllRegistrationId", UserController.getAllRegistrationIds);
router.post("/approve", UserController.approveUser);
router.post("/reject", UserController.rejectUser);
router.post("/suspend", UserController.suspendUser);
router.post("/suspend/revoke", UserController.revokeSuspension);

module.exports = router;

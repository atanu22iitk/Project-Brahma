const express = require("express");
const router = express.Router();
const UserController = require("./Controller");

router.post("/getAllUsers", UserController.getAllUsers);
router.post("/getUserById", UserController.getUserById);
router.post("/getUsersByType", UserController.getUsersByType);
router.post("/getAllRegistrationIds", UserController.getAllRegistrationIds);
router.post("/approve", UserController.approveUser);
router.post("/reject", UserController.rejectUser);
router.post("/suspend", UserController.suspendUser);
router.post("/suspend/revoke", UserController.revokeSuspension);
router.post("/getAllPendingUserIds", UserController.getAllPendingUserIds);

module.exports = router;

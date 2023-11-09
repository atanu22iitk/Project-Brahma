const express = require("express");
const router = express.Router();
const UserController = require("./Controller");

router.get("/getAllUsers", UserController.getAllUsers);
router.post("/getUserById", UserController.getUserById);
router.post("/getUsersByType", UserController.getUsersByType);
router.get("/getAllRegistrationIds", UserController.getAllRegistrationIds);
router.post("/approve", UserController.approveUser);
router.post("/reject", UserController.rejectUser);
router.post("/suspend", UserController.suspendUser);
router.post("/suspend/revoke", UserController.revokeSuspension);
router.get("/getAllPendingUserIds", UserController.getAllPendingUserIds);

module.exports = router;

const ErrorResponse = require("../Middlewares/errorHandler");
const { UserModel } = require("../User/Model");
const { generateHash } = require("../Utils/hash");
const { UserStatus } = require("./Utils");

class UserController {
  /**
   * Registers a new user in the system.
   * @param {String} id - The unique identifier for the user.
   * @param {Object} userData - The data for the new user to be registered.
   * @returns {Object} The newly created user object.
   */
  static registerUser = async (id, userData) => {
    try {
      if (
        !userData.userType ||
        !userData.firstName ||
        !userData.age ||
        !userData.gender ||
        !userData.mobileNo ||
        !userData.mailId ||
        !userData.password ||
        !userData.confirmPassword ||
        !userData.tc
      ) {
        return new ErrorResponse("User data all fields must required", 400);
      }

      if (userData.password !== userData.confirmPassword)
        return new ErrorResponse(
          "Password and Confirm password must be same",
          400
        );
      if (userData.tc != true) return new ErrorResponse("Tc must be true", 400);

      const user = await UserModel.findOne({
        userId: id,
      });
      if (user) return new ErrorResponse("User already exist", 400);

      const hashedPassword = await generateHash(userData.password);
      console.log(userData.userType);

      const newUser = await UserModel({
        userType: userData.userType,
        userId: id,
        profilePic: userData.profilePic,
        firstName: userData.firstName,
        middleName: userData.middleName,
        lastName: userData.lastName,
        age: userData.age,
        gender: userData.gender,
        mobileNo: userData.mobileNo,
        mailId: userData.mailId,
        password: hashedPassword,
        tc: userData.tc,
      });

      await newUser.save();
      return newUser;
    } catch (err) {
      throw err;
    }
  };

  /**
   * Updates the details of an existing user.
   * @param {String} id - The unique identifier for the user.
   * @param {Object} userData - The updated data for the user.
   * @returns {Boolean} True if the update was successful.
   */
  static updateUser = async (id, userData) => {
    try {
      const user = await UserModel.findOne({ userId: id });
      if (!user) return new ErrorResponse("User not found", 400);

      const updates = {};
      if ("age" in userData) updates.age = userData.age;
      if ("mobileNo" in userData) updates.mobileNo = userData.mobileNo;
      if ("mailId" in userData) updates.mailId = userData.mailId;

      if ("password" in userData) {
        if (
          !userData.password ||
          !userData.confirmPassword ||
          userData.password !== userData.confirmPassword
        ) {
          return new ErrorResponse(
            "Password and Confirm Password must be provided and match",
            400
          );
        }
        updates.password = await generateHash(userData.password);
      }

      const updatedUser = await UserModel.updateOne(
        { userId: id },
        { $set: updates }
      );
      if (updatedUser.nModified === 0) {
        return next(
          new ErrorResponse("Error while updating user details", 400)
        );
      }

      return true;
    } catch (err) {
      if (!(err instanceof ErrorResponse)) {
        err = new ErrorResponse("Error while updating user", 400);
      }
      throw err;
    }
  };

  /**
   * Deletes an existing user from the database.
   * @param {String} id - The unique identifier for the user to be deleted.
   * @returns {Object} The result of the deletion operation.
   * @throws {ErrorResponse} When the user is not found or the deletion fails.
   */
  static deleteUser = async (id) => {
    try {
      const user = await UserModel.findOne({ userId: id });
      if (!user) {
        throw new ErrorResponse("User not found", 404);
      }

      const deletionResult = await UserModel.deleteOne({ userId: id });
      if (deletionResult.deletedCount === 1) {
        return { status: true, message: "User successfully deleted" };
      } else {
        throw new ErrorResponse("Error while deleting user", 400);
      }
    } catch (err) {
      if (!(err instanceof ErrorResponse)) {
        throw new ErrorResponse("Error while deleting user", 400);
      }
      throw err;
    }
  };

  /**
   * Retrieves a user by their unique identifier.
   * @param {String} userId - The unique identifier for the user to retrieve.
   * @returns {Object} The user object if found.
   * @throws {ErrorResponse} When the user is not found.
   */
  static getUserById = async (id, req, res, next) => {
    try {
      let userId;
      if (req.body.userId) {
        userId = req.body.userId;
      } else if (req.params.userId) {
        userId = req.params.userId;
      } else if (id) {
        userId = id;
      }
      const user = await UserModel.findOne({ userId: userId });
      if (!user) {
        throw new ErrorResponse("User not found", 404);
      }
      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (err) {
      if (!(err instanceof ErrorResponse)) {
        next(new ErrorResponse("Error retrieving user", 400));
      }
      throw err;
    }
  };

  /**
   * Retrieves all users from the system.
   * @returns {Array} An array of all user objects.
   * @throws {ErrorResponse} When there is an error retrieving users.
   */
  static getAllUsers = async (req, res, next) => {
    try {
      const users = await UserModel.find({});
      res.status(200).json({
        success: true,
        data: { users },
      });
    } catch (err) {
      throw new ErrorResponse("Error retrieving users", 400);
    }
  };

  /**
   * Retrieves users by their type.
   * @param {Number} userType - The type of users to retrieve.
   * @returns {Array} An array of user objects of the specified type.
   * @throws {ErrorResponse} When no users are found for the given type or there is an error during retrieval.
   */
  static getUsersByType = async (user_type, req, res, next) => {
    try {
      let userType;
      if (req.body.userType) {
        userType = req.body.userType;
      } else if (req.params.userType) {
        userType = req.params.userType;
      } else if (user_type) {
        userType = user_type;
      }
      const users = await UserModel.find({ userType: userType });
      const user = users ? users : [];

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (err) {
      if (!(err instanceof ErrorResponse)) {
        throw new ErrorResponse("Error retrieving users by type", 400);
      }
      throw err;
    }
  };

  /**
   * Retrieves all registration IDs from the system.
   * @returns {Array} An array of registration IDs.
   * @throws {ErrorResponse} When there is an error retrieving registration IDs.
   */
  static getAllRegistrationIds = async (req, res, next) => {
    try {
      // select only userId field
      const users = await UserModel.find({}, "userId");
      const usersId = users.map((user) => user.userId);
      res.status(200).json({
        success: true,
        data: { usersId },
      });
    } catch (err) {
      throw new ErrorResponse("Error retrieving registration IDs", 400);
    }
  };

  /**
   * Approves a user's registration.
   * @param {String} userId - The unique identifier for the user to approve.
   * @returns {Object} The updated user object.
   * @throws {ErrorResponse} When the user is not found or the update fails.
   */
  static approveUser = async (userId) => {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { userId, status: UserStatus.PENDING },
        { status: UserStatus.APPROVED },
        { new: true }
      );

      if (!updatedUser) {
        throw new ErrorResponse("User not found or not pending approval", 400);
      }

      return updatedUser;
    } catch (err) {
      throw new ErrorResponse("Error approving user", 400);
    }
  };

  /**
   * Rejects a user's registration.
   * @param {String} userId - The unique identifier for the user to reject.
   * @returns {Object} The updated user object.
   * @throws {ErrorResponse} When the user is not found or the update fails.
   */
  static rejectUser = async (userId) => {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { userId, status: UserStatus.PENDING },
        { status: UserStatus.REJECTED },
        { new: true }
      );

      if (!updatedUser) {
        throw new ErrorResponse("User not found or not pending approval", 400);
      }

      return updatedUser;
    } catch (err) {
      throw new ErrorResponse("Error rejecting user", 400);
    }
  };

  /**
   * Suspends a user's account.
   * @param {String} userId - The unique identifier for the user to suspend.
   * @returns {Object} The updated user object.
   * @throws {ErrorResponse} When the user is not found or the update fails.
   */
  static suspendUser = async (userId) => {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { userId, status: { $ne: UserStatus.SUSPENDED } },
        { status: UserStatus.SUSPENDED },
        { new: true }
      );

      if (!updatedUser) {
        throw new ErrorResponse("User not found or already suspended", 400);
      }

      return updatedUser;
    } catch (err) {
      throw new ErrorResponse("Error suspending user", 400);
    }
  };

  /**
   * Revokes suspension of a user's account.
   * @param {String} userId - The unique identifier for the user to revoke suspension.
   * @returns {Object} The updated user object.
   * @throws {ErrorResponse} When the user is not found or the update fails.
   */
  static revokeSuspension = async (userId) => {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { userId, status: UserStatus.SUSPENDED },
        { status: UserStatus.APPROVED },
        { new: true }
      );

      if (!updatedUser) {
        throw new ErrorResponse("User not found or not suspended", 400);
      }

      return updatedUser;
    } catch (err) {
      throw new ErrorResponse("Error revoking suspension", 400);
    }
  };

  /**
   * Retrieves the IDs of all users with a pending status.
   * @returns {Array} An array of user IDs with pending status.
   * @throws {ErrorResponse} When there is an error retrieving the user IDs.
   */
  static getAllPendingUserIds = async (req, res, next) => {
    try {
      const pendingUsers = await UserModel.find(
        { status: UserStatus.PENDING },
        "userId"
      );
      const pendingUserIDs = pendingUsers.map((user) => user.userId);
      res.status(200).json({
        success: true,
        data: { pendingUserIDs },
      });
    } catch (err) {
      console.error("Error retrieving pending user IDs:", err);
      throw new ErrorResponse("Error retrieving pending user IDs", 400);
    }
  };
}

module.exports = UserController;

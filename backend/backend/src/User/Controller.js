const ErrorResponse = require("../Middlewares/errorHandler");
const { UserModel } = require("../User/Model");
const { generateHash } = require("../Utils/hash");

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
        !userData.profilePic ||
        !userData.firstName ||
        !userData.age ||
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

      const newUser = await UserModel({
        userType: userData.userType,
        userId: id,
        profilePic: userData.profilePic,
        firstName: userData.firstName,
        middleName: userData.middleName,
        lastName: userData.lastName,
        age: userData.age,
        mobileNo: userData.mobileNo,
        mailId: userData.mailId,
        password: hashedPassword,
        tc: userData.tc,
      });

      await newUser.save();
      return newUser;
    } catch (err) {
      if (!(err instanceof ErrorResponse)) {
        err = new ErrorResponse("Error while creating user", 400);
      }
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
 * Retrieves a user by their unique identifier.
 * @param {String} userId - The unique identifier for the user to retrieve.
 * @returns {Object} The user object if found.
 * @throws {ErrorResponse} When the user is not found.
 */
  static getUserById = async (userId) => {
    try {
      const user = await UserModel.findOne({ userId: userId });
      if (!user) {
        throw new ErrorResponse("User not found", 404);
      }
      return user;
    } catch (err) {
      if (!(err instanceof ErrorResponse)) {
        throw new ErrorResponse("Error retrieving user", 400);
      }
      throw err;
    }
  };

  /**
 * Retrieves all users from the system.
 * @returns {Array} An array of all user objects.
 * @throws {ErrorResponse} When there is an error retrieving users.
 */
  static getAllUsers = async () => {
    try {
      const users = await UserModel.find({});
      return users;
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
  static getUsersByType = async (userType) => {
    try {
      const users = await UserModel.find({ userType: userType });
      if (!users.length) {
        throw new ErrorResponse("No users found for the given type", 404);
      }
      return users;
    } catch (err) {
      if (!(err instanceof ErrorResponse)) {
        throw new ErrorResponse("Error retrieving users by type", 400);
      }
      throw err;
    }
  };
}

module.exports = UserController ;

const ErrorResponse = require("../Middlewares/errorHandler");
const { UserModel } = require("../User/Model");
const { generateHash } = require("../Utils/hash");

const registerUser = async (id, userData) => {
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

const updateUser = async (id, userData) => {
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
      return next(new ErrorResponse("Error while updating user details", 400));
    }

    return true;
  } catch (err) {
    if (!(err instanceof ErrorResponse)) {
      err = new ErrorResponse("Error while updating user", 400);
    }
    throw err;
  }
};

module.exports = { registerUser, updateUser };

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
    if (
      userData.mobileNo ||
      userData.mailId ||
      userData.age ||
      userData.password ||
      userData.confirmPassword
    ) {
      if (userData.password !== userData.confirmPassword) {
        return new ErrorResponse(
          "Password and Confirm Password must be same",
          400
        );
      }
      const user = await UserModel.findOne({ userId: id });
      if (!user) return new ErrorResponse("User not found", 400);

      const hashedPassword = await generateHash(userData.password);
      if (!hashedPassword || hashedPassword == "") {
        return new ErrorResponse("Error while genrating hash password", 400);
      }
    }
  } catch (err) {
    if (!(err instanceof ErrorResponse)) {
      err = new ErrorResponse("Error while creating user", 400);
    }
    throw err;
  }
};

module.exports = { registerUser, updateUser };

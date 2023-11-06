const ErrorResponse = require("../Middlewares/errorHandler");
const UserModel = require("../Model/Model");
const { DoctorModel } = require("./Model");
const { generateHash, decryptHash } = require("../Utils/hash");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../Utils/access_token");
const mailSender = require("../Services/mailSender");
const Crypto = require("../Crypto/crypto");

class DoctorAuthController {
  // Function to login doctor with id
  static doctorLogin = async (req, res, next) => {
    try {
      const { id, password } = req.body;
      if (!id || !password)
        return next(new ErrorResponse("All fields are required", 400));

      const user = await UserModel.findOne({ userId: id });
      if (!user) return next(new ErrorResponse("User not found", 400));
      const userJSON = user ? user.toJSON() : null;

      const doctor = await DoctorModel.findOne({ profile: user._id });
      if (!doctor) return next(new ErrorResponse("Doctor not found", 400));
      const doctorJSON = doctor ? doctor.toJSON() : null;

      const isPasswordMatch = await decryptHash(password, userJSON.password);
      if (!isPasswordMatch)
        return next(new ErrorResponse("Id and password incorrect", 400));

      const token = await generateAccessToken(
        userJSON.userId,
        userJSON.userType,
        doctorJSON.roles
      );
      const refreshToken = await generateRefreshToken(
        userJSON.doctorId,
        userJSON.userType,
        doctorJSON.roles
      );

      const mailResponse = await mailSender(userJSON.mailId, "TEST", "TEST");
      if (!mailResponse)
        return next(new ErrorResponse("Error while sending mail", 400));

      const generateKeyPair = Crypto.generateKeyPair();
      if (!generateKeyPair)
        return next(new ErrorResponse("Error while generate key pair", 400));

      res.status(200).json({
        success: true,
        data: "User login successfully",
        accessToken: token,
        refreshToken: refreshToken,
        publicKey: generateKeyPair.publicKey,
        privateKey: generateKeyPair.privateKey,
      });
    } catch (err) {
      next(err);
    }
  };

  // Function to update doctor password
  static doctorUpdatePassword = async (req, res, next) => {
    try {
      const { id, oldPassword, newPassword, confirmNewPassword } = req.body;

      if (!doctorId || !oldPassword || !newPassword || !confirmNewPassword) {
        return next(new ErrorResponse("All fields are required", 400));
      }

      if (newPassword !== confirmNewPassword) {
        return next(
          new ErrorResponse(
            "new password and confirm password must be same",
            400
          )
        );
      }

      const user = await UserModel.findOne({ userId: id });
      if (!user) return next(new ErrorResponse("User not found", 400));
      const userJSON = user ? user.toJSON() : null;

      const isPasswordMatch = await decryptHash(oldPassword, userJSON.password);
      if (!isPasswordMatch)
        return next(new ErrorResponse("Id and password incorrect", 400));

      const hashPassword = await generateHash(newPassword);

      await UserModel.findOneAndUpdate(
        { userId: id },
        {
          $set: { password: hashPassword },
        }
      );
      res.send({ status: "success", message: "Password changed succesfully" });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = DoctorAuthController;

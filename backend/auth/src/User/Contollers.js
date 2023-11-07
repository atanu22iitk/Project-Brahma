const ErrorResponse = require("../Middlewares/errorHandler");
const { UserModel, DoctorModel, StaffModel } = require("./Model");
const { generateHash, decryptHash } = require("../Utils/hash");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../Utils/access_token");
const mailSender = require("../Services/mailSender");
const Crypto = require("../Crypto/crypto");
const generateOtp = require("../Utils/otp");

class UserAuthController {
  /**
   * Logs in a doctor with the id and password.
   * @param {Object} req - The request object containing credentials.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  static login = async (req, res, next) => {
    try {
      const { id, password } = req.body;
      if (!id || !password)
        return next(new ErrorResponse("All fields are required", 400));

      const user = await UserModel.findOne({ userId: id });
      if (!user) return next(new ErrorResponse("User not found", 400));
      const userJSON = user ? user.toJSON() : null;

      const isPasswordMatch = await decryptHash(password, userJSON.password);
      if (!isPasswordMatch)
        return next(new ErrorResponse("Id and password incorrect", 400));

      const Otp = await generateOtp();
      if (!Otp) return next(new ErrorResponse("Error while generate OTP", 400));

      const mailResponse = await mailSender(
        userJSON.mailId,
        "Verify otp for registration",
        Otp
      );
      if (!mailResponse)
        return next(new ErrorResponse("Error while sending mail", 400));

      res.status(200).json({
        success: true,
        data: "User login successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Verify login credentials via otp
   * @param {Object} req - The request object containing credentials.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  static verifyLogin = async (req, res, next) => {
    try {
      const { id, otp } = req.body;
      if (!otp) return next(new ErrorResponse("Otp must be required", 400));

      const user = await UserModel.findOne({ userId: id });
      if (!user) return next(new ErrorResponse("User not found", 400));
      const userJSON = user ? user.toJSON() : null;

      let doctorJSON;
      if (userJSON.userType === 3) {
        const doctor = await DoctorModel.findOne({ profile: user._id });
        if (!doctor) return next(new ErrorResponse("Doctor not found", 400));
        doctorJSON = doctor ? doctor.toJSON() : null;
      }

      let staffJSON;
      if(userJSON.userType === 4){
        const staff = await StaffModel.findOne({profile: user._id});
        if(!staff) return next(new ErrorResponse("Staff not found", 400));
        staffJSON = staff ? staff.toJSON() : null;
      }

      const userRoles =
        userJSON.userType === 3 || userJSON.userType === 4
          ? doctorJSON.roles
          : [];
      const token = await generateAccessToken(
        userJSON.userId,
        userJSON.userType,
        userRoles
      );

      const refreshToken = await generateRefreshToken(
        userJSON.doctorId,
        userJSON.userType,
        userRoles
      );

      const generateKeyPair = Crypto.generateKeyPair();
      if (!generateKeyPair)
        return next(new ErrorResponse("Error while generate key pair", 400));

      res.status(200).json({
        success: true,
        data: "User login verify successfully",
        accessToken: token,
        refreshToken: refreshToken,
        publicKey: generateKeyPair.publicKey,
        privateKey: generateKeyPair.privateKey,
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Update password
   * @param {Object} req - The request object containing details
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  static updatePassword = async (req, res, next) => {
    try {
      const { id, oldPassword, newPassword, confirmNewPassword } = req.body;

      if (!id || !oldPassword || !newPassword || !confirmNewPassword) {
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

module.exports = UserAuthController;

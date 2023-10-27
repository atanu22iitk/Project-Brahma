const ErrorResponse = require("../Middlewares/errorHandler");
const UserModel = require("../Model/Model");
const { generateHash, decryptHash } = require("../Utils/hash");
const {generateAccessToken, generateRefreshToken} = require("../Utils/access_token");

class DoctorAuthController {
  static doctorLogin = async (req, res, next) => {
    try {
      const { user_type, id, password } = req.body;
      if (!user_type || !id || !password) return next(new ErrorResponse("All fields are required", 400));

      const user = (await UserModel.findOne({ id: id })).toJSON();
      if (!user) return next(new ErrorResponse("User not found", 400));

      const isPasswordMatch = await decryptHash(password, user.profile.password);
      if (!isPasswordMatch) return next(new ErrorResponse("Id and password incorrect", 400));
    
      const token = await generateAccessToken(user.id, user.profile.user_type, user.roles);
      const refreshToken = await generateRefreshToken(user.id, user.profile.user_type, user.roles);

      res.status(200).json({ success: true, data: "User login successfully", accessToken: token, refreshToken: refreshToken });
    } catch (err) {
      next(err);
    }
  };

  static doctorUpdatePassword = async (req, res, next) => {
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

      const user = await UserModel.findOne({ id: id });
      if (!user) {
        return next(new ErrorResponse("User not found", 400));
      }

      const isPasswordMatch = await decryptHash(oldPassword, user.profile.password);
      if (!isPasswordMatch) {
        return next(new ErrorResponse("Id and password incorrect", 400));
      }

      const hashPassword = await generateHash(newPassword);

      await DoctorModel.findOneAndUpdate({id: user.id}, {
        $set: { 'profile.password': hashPassword },
      });
      console.log(user);
      res.send({ status: "success", message: "Password changed succesfully" });
    } catch (err) {
      next(err);
    }
  };

}

module.exports = DoctorAuthController;

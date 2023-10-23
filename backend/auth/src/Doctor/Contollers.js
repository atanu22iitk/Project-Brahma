const ErrorResponse = require("../Utils/error");
const DoctorModel = require("./Model");
const { generateHash, decryptHash } = require("../Utils/hash");

class DoctorAuthController {
  static doctorLogin = async (req, res, next) => {
    try {
      const { id, password } = req.body;

      if (!id || !password) {
        return next(new ErrorResponse("All fields are required", 400));
      }

      const user = await DoctorModel.findOne({ id: id });
      if (!user) {
        return next(new ErrorResponse("User not found", 400));
      }

      const isPasswordMatch = await decryptHash(password, user.password);
      if (!isPasswordMatch) {
        return next(new ErrorResponse("Id and password incorrect", 400));
      }

      res.status(200).json({ success: true, data: "User login successfully" });
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

      const user = await DoctorModel.findOne({ id: id });
      if (!user) {
        return next(new ErrorResponse("User not found", 400));
      }

      const isPasswordMatch = await decryptHash(oldPassword, user.password);
      if (!isPasswordMatch) {
        return next(new ErrorResponse("Id and password incorrect", 400));
      }

      const hashPassword = await generateHash(newPassword);

      await DoctorModel.findByIdAndUpdate(id, {
        $set: { password: hashPassword },
      });
      res.send({ status: "success", message: "Password changed succesfully" });
    } catch (err) {
      next(err);
    }
  };
  
}

module.exports = DoctorAuthController;

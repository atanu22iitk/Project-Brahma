const {DoctorModel, UserModel } = require("./Model");
const ErrorResponse = require("../Utils/error");
const { generateHash, decryptHash } = require("../Utils/hash");
const { generateDoctorId } = require("./Utils");

class DoctorController {
  static registerDoctor = async (req, res, next) => {
    try {
      const {
        serviceNo,
        rank,
        firstName,
        middleName,
        lastName,
        fieldOfSpecialisation,
        employedAs,
        department,
        mobileNo,
        mailId,
        password,
        confirmPassword,
        tc,
      } = req.body;

      const user = await DoctorModel.findOne({ mailId: mailId });
      if (user) {
        return next(new ErrorResponse("User already exists", 400));
      }

      if (
        !serviceNo ||
        !rank ||
        !firstName ||
        !fieldOfSpecialisation ||
        !employedAs ||
        !department ||
        !mobileNo ||
        !mailId ||
        !password ||
        !confirmPassword
      ) {
        return next(new ErrorResponse("All fields are required", 400));
      }

      if (password !== confirmPassword) {
        return next(new ErrorResponse("Passwords does not match", 400));
      }

      if (tc != true) {
        return next(new ErrorResponse("tc must be true", 400));
      }

      const hashedPassword = await generateHash(password);
      const newDoctorId = await generateDoctorId();

      const newDoctor = new DoctorModel({
        id: newDoctorId,
        serviceNo,
        rank,
        firstName,
        middleName,
        lastName,
        fieldOfSpecialisation,
        employedAs,
        department,
        mobileNo,
        mailId,
        password: hashedPassword,
        tc,
      });

      await newDoctor.save();

      res.status(200).json({
        success: true,
        data: { newDoctor },
      });
    } catch (err) {
      next(err);
    }
  }

}

module.exports = DoctorController;

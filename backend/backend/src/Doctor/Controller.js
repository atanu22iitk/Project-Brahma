const {DoctorModel } = require("./Model");
const ErrorResponse = require("../Middlewares/errorHandler");
const { generateHash } = require("../Utils/hash");
const { generateDoctorId } = require("./Utils");

class DoctorController {
  static registerDoctor = async (req, res, next) => {
    try {
      const {
        profile,
        serviceNo,
        roles,
        rank,
        fieldOfSpecialisation,
        employedAs,
        department,
      } = req.body;

      const user = await DoctorModel.findOne({ serviceNo: serviceNo });
      if (user) {
        return next(new ErrorResponse("Doctor already exists", 400));
      }

      if (
        !serviceNo ||
        !rank ||
        !profile ||
        !fieldOfSpecialisation ||
        !employedAs ||
        !department ||
        !roles 
      ) {
        return next(new ErrorResponse("All fields are required", 400));
      }

      if (profile.password !== profile.confirmPassword) {
        return next(new ErrorResponse("Passwords does not match", 400));
      }

      if (profile.tc != true) {
        return next(new ErrorResponse("tc must be true", 400));
      }

      const hashedPassword = await generateHash(profile.password);
      profile.password = hashedPassword;

      const newDoctor = new DoctorModel({
        doctorId: await generateDoctorId(),
        profile: profile,
        roles: roles,
        serviceNo,
        rank,
        fieldOfSpecialisation,
        employedAs,
        department,
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

const ErrorResponse = require("../Middlewares/errorHandler");
const { DoctorModel } = require("./Model");
const { generateDoctorId } = require("./Utils");
const { registerUser } = require("../User/Controller");

class DoctorController {
  static registerDoctor = async (req, res, next) => {
    try {
      const { userData, doctorData } = req.body;

      const doctorId = await generateDoctorId();
      let userDetails;
      try {
        userDetails = await registerUser(doctorId, userData);
      } catch (err) {
        next(
          new ErrorResponse("Error received while return user details", 400)
        );
      }

      console.log("userDetails", userDetails)
      if (
        !doctorData.roles ||
        !doctorData.serviceNo ||
        !doctorData.rank ||
        !doctorData.fieldOfSpecialisation ||
        !doctorData.employedAs ||
        !doctorData.department
      ) {
        return next(new ErrorResponse("Doctor all fields required", 400));
      }

      const doctor = await DoctorModel.findOne({
        serviceNo: doctorData.serviceNo,
      });
      if (doctor) return next(new ErrorResponse("Doctor already exist", 400));

      const newDoctor = await DoctorModel({
        profile: userDetails,
        roles: doctorData.roles,
        serviceNo: doctorData.serviceNo,
        rank: doctorData.rank,
        fieldOfSpecialisation: doctorData.fieldOfSpecialisation,
        employedAs: doctorData.employedAs,
        department: doctorData.department,
      });

      await newDoctor.save();

      res.status(200).json({
        success: true,
        data: { newDoctor },
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = DoctorController;

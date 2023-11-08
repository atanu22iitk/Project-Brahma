const ErrorResponse = require("../Middlewares/errorHandler");
const { DoctorModel } = require("./Model");
const { generateDoctorId } = require("./Utils");
const { UserController } = require("../User/Controller");

class DoctorController {
  static registerDoctor = async (req, res, next) => {
    try {
      const { userData, doctorData } = req.body;

      const doctorId = await generateDoctorId();
      let userDetails;
      try {
        userDetails = await UserController.registerUser(doctorId, userData);
      } catch (err) {
        next(
          new ErrorResponse("Error received while return user details", 400)
        );
      }

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

  static updateDoctor = async (req, res, next) => {
    try {
      const { doctorId, doctorData, userData } = req.body;

      const user = await UserController.updateUser(doctorId, userData);
      if (!user)
        return next(
          new ErrorResponse("Error while updating user details", 400)
        );

      const doctor = await DoctorModel.findOne({ profile: user._id });
      if (!doctor) return next(new ErrorResponse("Doctor not found", 400));

      const updates = {};
      if ("rank" in doctorData) updates.rank = doctorData.rank;
      if ("presentUnit" in doctorData)
        updates.presentUnit = doctorData.presentUnit;

      const updateResult = await DoctorModel.updateOne(
        { profile: user._id },
        { $set: updates }
      );
      if (updateResult.nModified === 0) {
        throw new ErrorResponse(
          "Update failed, doctor details not modified",
          400
        );
      }

      const updatedDoctor = await DoctorModel.findOne({ profile: user._id });
      res.send(200).json({
        success: true,
        data: { updatedDoctor },
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = DoctorController;

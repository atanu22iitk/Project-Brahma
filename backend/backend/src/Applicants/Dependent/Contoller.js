const ErrorResponse = require("../../Middlewares/errorHandler");
const DependentModel = require("./DependentModel");
const { generateDependentId } = require("./Utils");
const { registerUser } = require("../../User/Controller");
const { PatientModel } = require("../Model");

class DependentController {
  static registerDependent = async (req, res, next) => {
    try {
      const { userData, dependentData } = req.body;

      const dependentId = await generateDependentId();
      if (!dependentId)
        return next(
          new ErrorResponse("Error while generating dependent id", 400)
        );
      let userDetails;
      try {
        userDetails = await registerUser(dependentId, userData);
      } catch (err) {
        next(new ErrorResponse("Error while return user details", 400));
      }
      if (
        !dependentData.relationId ||
        !dependentData.relation ||
        !dependentData.verificationId
      ) {
        return next(
          new ErrorResponse("Dependent all fields must required", 400)
        );
      }

      const dependent = await DependentModel.findOne({
        "profile.userId": dependentId,
      });
      if (dependent)
        return next(new ErrorResponse("Dependent already exsits", 400));

      const newDependent = await DependentModel({
        patientId: dependentId,
        profile: userDetails,
        relationId: dependentData.relationId,
        relation: dependentData.relation,
        verificationId: dependentData.verificationId,
      });

      const newPatient = await PatientModel({
        patientId: dependentId,
      });

      await newDependent.save();
      await newPatient.save();
      res.send(200).json({
        success: true,
        data: { newDependent },
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { DependentController };

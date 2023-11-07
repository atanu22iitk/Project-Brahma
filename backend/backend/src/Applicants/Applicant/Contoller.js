const ErrorResponse = require("../../Middlewares/errorHandler");
const { ApplicantModel } = require("./ApplicantModel");
const { generateApplicantId } = require("./Utils");
const { registerUser } = require("../../User/Controller");

class ApplicantController {
  static registerApplicant = async (req, res, next) => {
    try {
      const { userData, applicantData } = req.body;

      const applicantId = await generateApplicantId();
      if (!applicantId)
        return next(new ErrorResponse("Error while genrate applicant id", 400));
      let userDetails;
      try {
        userDetails = await registerUser(applicantId, userData);
      } catch (err) {
        next(new ErrorResponse("Error while return user details", 400));
      }
      if (
        !applicantData.serviceNo ||
        !applicantData.rank ||
        !applicantData.parentService ||
        !applicantData.presentUnit ||
        !applicantData.nextOfKin
      ) {
        return next(
          new ErrorResponse("Applicant all fields are required", 400)
        );
      }
      const applicant = await ApplicantModel.findOne({
        serviceNo: applicantData.serviceNo,
      });
      if (applicant)
        return next(new ErrorResponse("Applicant already exist", 400));

      const newApplicant = await ApplicantModel({
        profile: userDetails,
        rank: applicantData.rank,
        parentService: applicantData.parentService,
        presentUnit: applicantData.presentUnit,
        nextOfKin: applicantData.nextOfKin,
      });

      await newApplicant.save();

      res.status(200).json({
        success: true,
        data: { newApplicant },
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { ApplicantController };

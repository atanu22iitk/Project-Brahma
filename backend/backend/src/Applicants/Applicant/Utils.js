const ApplicantModel  = require("./ApplicantModel.js");
const ErrorResponse = require("../Middlewares/errorHandler");

async function generateApplicantId() {
  try {
    let unique = false;
    let newApplicantId = "";

    while (!unique) {
      const latestApplicant = await ApplicantModel.findOne().sort({ _id: -1 });
      let lastId = 0;
      if (latestApplicant && latestApplicant.profile.userId) {
        lastId = parseInt(latestApplicant.profile.userId.replace(/[^\d]/g, "")) || 0;
      }
      newApplicantId = `PAT${lastId + 1}`;

      const existingApplicant = await ApplicantModel.findOne({ 'profile.userId': newApplicantId });
      if (!existingApplicant) {
        unique = true;
      }
    }
    return newApplicantId;
  } catch (err) {
    throw new ErrorResponse("Error generating applicant ID", 400);
  }
}

module.exports = { generateApplicantId };

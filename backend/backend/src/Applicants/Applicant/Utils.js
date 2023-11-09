const ErrorResponse = require("../Middlewares/errorHandler");
const { PatientModel } = require("../Model");

async function generateApplicantId() {
  try {
    let unique = false;
    let newApplicantId = "";

    while (!unique) {
      const latestApplicant = await PatientModel.findOne().sort({ _id: -1 });
      let lastId = 0;
      if (latestApplicant && latestApplicant.patientId) {
        lastId = parseInt(latestApplicant.patientId.replace(/[^\d]/g, "")) || 0;
      }
      newApplicantId = `PAT${lastId + 1}`;

      const existingApp = await PatientModel.findOne({
        patientId: newApplicantId,
      });
      if (!existingApp) {
        unique = true;
      }
    }
    return newApplicantId;
  } catch (err) {
    throw new ErrorResponse("Error generating applicant ID", 400);
  }
}

module.exports = { generateApplicantId };

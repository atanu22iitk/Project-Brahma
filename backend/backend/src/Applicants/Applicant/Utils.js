const ApplicantModel = require("./ApplicantModel");

async function generateApplicantId() {
    try {
      const latestApplicant = await ApplicantModel.findOne().sort({ _id: -1 });
      let lastId = 0;
      if (latestApplicant && latestApplicant.applicantId) {
        lastId = parseInt(latestApplicant.applicantId.replace(/[^\d]/g, "")) || 0;
      }
      return `APPLICANT${lastId + 1}`;
    } catch (err) {
      console.error("Error generating applicant ID: ", err);
      throw new Error("Error generating applicant ID");
    }
  }

  module.exports = { generateApplicantId };
const ErrorResponse = require("../Middlewares/errorHandler");
const { PatientModel } = require("../Model");

async function generateDependentId() {
  try {
    let unique = false;
    let newDependentId = "";

    while (!unique) {
      const latestDependent = await PatientModel.findOne().sort({ _id: -1 });
      let lastId = 0;
      if (latestDependent && latestDependent.patientId) {
        lastId = parseInt(latestDependent.patientId.replace(/[^\d]/g, "")) || 0;
      }
      newDependentId = `PAT${lastId + 1}`;

      const existingDep = await PatientModel.findOne({
        patientId: newDependentId,
      });
      if (!existingDep) {
        unique = true;
      }
    }
    return newDependentId;
  } catch (err) {
    throw new ErrorResponse("Error generating dependent ID", 400);
  }
}

module.exports = { generateDependentId };

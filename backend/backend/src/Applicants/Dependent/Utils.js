const DependentModel = require("./DependentModel");
const ErrorResponse = require("../Middlewares/errorHandler");

async function generateDependentId() {
  try {
    let unique = false;
    let newDependentId = "";

    while (!unique) {
      const latestDependent = await DependentModel.findOne().sort({ _id: -1 });
      let lastId = 0;
      if (latestDependent && latestDependent.profile.userId) {
        lastId =
          parseInt(latestDependent.profile.userId.replace(/[^\d]/g, "")) || 0;
      }
      newDependentId = `DEP${lastId + 1}`;

      const existingDependent = await DependentModel.findOne({
        "profile.userId": newDependentId,
      });
      if (!existingDependent) {
        unique = true;
      }
    }
    return newDependentId;
  } catch (err) {
    throw new ErrorResponse("Error generating dependent ID", 400);
  }
}

module.exports = { generateDependentId };

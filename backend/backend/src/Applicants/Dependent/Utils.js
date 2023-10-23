const DependentModule = require("./DependentModel");

async function generateDependentId() {
    try {
      const latestDependent = await DependentModule.findOne().sort({ _id: -1 });
      let lastId = 0;
      if (latestDependent && latestDependent.dependentId) {
        lastId = parseInt(latestDependent.dependentId.replace(/[^\d]/g, "")) || 0;
      }
      return `DEPENDENT${lastId + 1}`;
    } catch (err) {
      console.error("Error generating dependent ID: ", err);
      throw new Error("Error generating dependent ID");
    }
  }

  module.exports = { generateDependentId };
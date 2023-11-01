const { DoctorModel } = require("./Model.js");
const ErrorResponse = require("../Middlewares/errorHandler");

async function generateDoctorId() {
  try {
    let unique = false;
    let newDoctorId = "";

    while (!unique) {
      const latestDoctor = await DoctorModel.findOne().sort({ _id: -1 });
      let lastId = 0;
      if (latestDoctor && latestDoctor.doctorId) {
        lastId = parseInt(latestDoctor.doctorId.replace(/[^\d]/g, "")) || 0;
      }
      newDoctorId = `DOCTOR${lastId + 1}`;

      const existingDoc = await DoctorModel.findOne({ doctorId: newDoctorId });
      if (!existingDoc) {
        unique = true;
      }
    }
    return newDoctorId;
  } catch (err) {
    throw new ErrorResponse("Error generating doctor ID", 400);
  }
}

module.exports = { generateDoctorId };

const DoctorModel = require("./Model.js");

async function generateDoctorId() {
  try {
    const latestDoctor = await DoctorModel.findOne().sort({ _id: -1 });
    let lastId = 0;
    if (latestDoctor && latestDoctor.doctorId) {
      lastId = parseInt(latestDoctor.doctorId.replace(/[^\d]/g, "")) || 0;
    }
    return `DOCTOR${lastId + 1}`;
  } catch (err) {
    console.error("Error generating doctor ID: ", err);
    throw new Error("Error generating doctor ID");
  }
}

module.exports = { generateDoctorId };

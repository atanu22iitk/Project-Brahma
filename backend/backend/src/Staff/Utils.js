const { MedicalStaffModel } = require("./Model.js");

class StaffUserType {
  static get PHARMACY() {
    return 1;
  }

  static get LABORATORY() {
    return 2;
  }

  static get RECEPTION() {
    return 3;
  }
} 

async function generateStaffId() {
  try {
    const latestStaff = await MedicalStaffModel.findOne().sort({ _id: -1 });
    let lastId = 0;
    if (latestStaff && latestStaff.staffId) {
      lastId = parseInt(latestStaff.staffId.replace(/[^\d]/g, "")) || 0;
    }
    return `STAFF${lastId + 1}`;
  } catch (err) {
    console.error("Error generating staff ID: ", err);
    throw new Error("Error generating staff ID");
  }
}

module.exports = { generateStaffId, StaffUserType };

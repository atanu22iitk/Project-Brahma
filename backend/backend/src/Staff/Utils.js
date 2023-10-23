const { MedicalStaffModel, StaffAssignedModel } = require("./Model.js");

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

async function generateAssignedStaffId(staffId) {
  try {
    const staff = await MedicalStaffModel.findOne({ staffId: staffId });
    const latestStaff = await StaffAssignedModel.findOne().sort({ _id: -1 });
    let lastId = 0;
    if (latestStaff && latestStaff.staffId) {
      lastId = parseInt(latestStaff.staffId.replace(/[^\d]/g, "")) || 0;
    }
    return `${staff.staffId}NEW${lastId + 1}`;
  } catch (err) {
    console.error("Error generating assigned staff ID: ", err);
    throw new Error("Error generating assigned staff ID");
  }
}

module.exports = { generateStaffId, generateAssignedStaffId };

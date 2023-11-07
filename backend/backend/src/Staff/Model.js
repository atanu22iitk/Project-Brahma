const mongoose = require("mongoose");
const Roles = require("../Utils/enums");

const MedicalStaffSchema = new mongoose.Schema({
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user' 
  },
  roles: [
    {
      type: Number,
      required: true,
      enum: Object.values(Roles),
    },
  ],
  serviceNo: {
    type: String,
    required: true,
    unique: true,
  },
  staffICardPassNo: {
    type: String,
    required: true,
    unique: true,
  },
  employedAs: {
    type: String,
    required: true,
  },
});

const StaffAssignmentSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MedicalStaff",
    required: true,
  },
  patientId: {
    type: String,
    required: true,
  },
  patientStaffICard: {
    type: String,
    required: true,
  },
  isDeregister: {
    type: Boolean,
    required: false,
  },
});

const MedicalStaffModel = mongoose.model("staff", MedicalStaffSchema);
const StaffAssignedModel = mongoose.model(
  "staffAssign",
  StaffAssignmentSchema
);
module.exports = { MedicalStaffModel, StaffAssignedModel };

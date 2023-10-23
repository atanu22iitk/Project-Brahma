const mongoose = require("mongoose");
const profile = require("../User/Model");
const Roles = require("../Utils/enums");

const MedicalStaffSchema = new mongoose.Schema({
  staffId: {
    type: String,
    unique: true,
  },
  profile: profile,
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

const MedicalStaff = mongoose.model("MedicalStaff", MedicalStaffSchema);
const StaffAssignment = mongoose.model(
  "StaffAssignment",
  StaffAssignmentSchema
);
module.exports = { MedicalStaff, StaffAssignment };

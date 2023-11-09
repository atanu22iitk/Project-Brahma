const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      typeof: String,
      unique: true,
    },
    ehrId: {
      type: [String],
      unique: true,
    },
    reportId: {
      type: [String],
      unique: true,
    },
  },
  { timestamps: true }
);

const PatientModel = mongoose.model("patient", patientSchema);
module.exports = { PatientModel };

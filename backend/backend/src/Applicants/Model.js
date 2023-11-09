const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      typeof: String,
      unique: true,
    },
    ehrId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "prescriptionRecord",
      },
    ],
    reportId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "labTestRecord",
      },
    ],
  },
  { timestamps: true }
);

const PatientModel = mongoose.model("patient", patientSchema);
module.exports = { PatientModel };

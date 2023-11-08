const mongoose = require("mongoose");
const LAB_TEST_TYPE = require("../Utils/enums");

const patientVitalSchema = new mongoose.Schema(
  {
    bloodPressure: {
      type: String,
      required: true,
    },
    temperature: {
      type: String,
      required: true,
    },
    pulse: {
      type: String,
      required: true,
    },
    spo2: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    chest: {
      type: Number,
      required: true,
    },
    waist: {
      type: Number,
      required: true,
    },
    hip: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const labTestSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.objectId,
    ref: "staff",
  },
  testCategory: {
    type: Number,
    required: true,
    enum: Object.values(LAB_TEST_TYPE),
  },
  testType: {
    type: String,
    required: true,
  },
  reportDetails: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

const prescriptionSchema = new mongoose.Schema(
  {
    patientOrDependentId: {
      type: mongoose.Schema.Types.objectId,
      required: true,
      validate: {
        validator: async function (id) {
          const patient = await mongoose.model("patient").findById(id).exec();
          const dependent = await mongoose
            .model("dependent")
            .findById(id)
            .exec();
          return !!(patient || dependent);
        },
        message: (props) => `${props.value} is not a patient nor dependent`,
      },
    },
    date: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    doctorId: {
      type: mongoose.Schema.Types.objectId,
      ref: "doctor",
    },
    patientVitals: patientVitalSchema,
    diagnosis: {
      type: String,
      required: true,
    },
    detailOfTreatment: {
      type: [String],
      required: true,
    },
    labReportId: {
      type: mongoose.Schema.Types.objectId,
      ref: "labTestRecord",
    },
    opinion: {
      type: String,
      required: true,
    },
    signature: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const PrescriptionModel = mongoose.model(
  "prescriptionRecord",
  prescriptionSchema
);
const LabTestModel = mongoose.model("labTestRecord", labTestSchema);
const PatientVitalModel = mongoose.model("patientVital", patientVitalSchema);
module.exports = { PrescriptionModel, LabTestModel, PatientVitalModel };

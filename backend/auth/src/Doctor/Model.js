const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  roles: {
    type: [Number],
    required: true
  },
  serviceNo: {
    type: String,
    required: true,
    unique: true,
  },
  rank: {
    type: String,
    required: true,
  },
  fieldOfSpecialisation: {
    type: String,
    required: true,
  },
  employedAs: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
});

const DoctorModel = mongoose.model("doctor", doctorSchema);
module.exports = { DoctorModel };

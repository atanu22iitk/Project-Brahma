const mongoose = require("mongoose");
const Roles = require("../Utils/enums");

const doctorSchema = new mongoose.Schema({
  doctorId: {
    type: String,
    unique: true,
  },
  userData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  roles: {
    type: [Number],
    required: true,
    enum: Object.values(Roles),
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

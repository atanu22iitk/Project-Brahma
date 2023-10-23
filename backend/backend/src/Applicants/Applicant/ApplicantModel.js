const mongoose = require("mongoose");
const profile = require("../../User/Model");

const applicantSchema = new mongoose.Schema({
  applicantId: {
    type: String,
    unique: true,
  },
  profile: profile,
  serviceNo: {
    type: String,
    required: true,
    unique: true,
  },
  rank: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  parentService: {
    type: String,
    required: true,
  },
  presentUnit: {
    type: String,
    required: true,
  },
  nextOfKin: {
    type: String,
    required: true,
  },
});

const Applicant = mongoose.model("Applicant", applicantSchema);
module.exports = Applicant;

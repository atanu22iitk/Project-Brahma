const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema({
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user' 
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
module.exports = {Applicant};

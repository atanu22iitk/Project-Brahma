const mongoose = require("mongoose");

const dependentSchema = new mongoose.Schema({
  patientId: {
    type: String,
    unique: true,
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  relationId: {
    type: String,
    required: true,
  },
  relation: {
    type: String,
    required: true,
  },
  verificationId: {
    type: String,
    required: true,
  },
});

const Dependent = mongoose.model("Dependent", dependentSchema);
module.exports = { Dependent };

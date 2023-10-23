const mongoose = require("mongoose");
const profile = require("../../User/Model");

const dependentSchema = new mongoose.Schema({
  dependentId: {
    type: String,
    unique: true,
  },
  profile: profile,
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
  age: {
    type: Number,
    required: true,
  },
});

const Dependent = mongoose.model("Dependent", dependentSchema);
module.exports = Dependent;

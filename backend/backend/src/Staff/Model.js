const mongoose = require("mongoose");
const {StaffUserType} = require("./Utils");

const MedicalStaffSchema = new mongoose.Schema({
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user' 
  },
  roles: [
    {
      type: Number,
      required: true,
      enum: Object.values(StaffUserType),
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

const MedicalStaffModel = mongoose.model("staff", MedicalStaffSchema);
module.exports = { MedicalStaffModel };

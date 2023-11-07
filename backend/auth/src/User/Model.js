const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const doctorSchema = new mongoose.Schema({}, { strict: false });
const staffSchema = new mongoose.Schema({}, { strict: false });

const UserModel = mongoose.model("user", userSchema);
const DoctorModel = mongoose.model("doctor", doctorSchema);
const StaffModel = mongoose.model("staff", staffSchema);

module.exports = { UserModel, DoctorModel, StaffModel };

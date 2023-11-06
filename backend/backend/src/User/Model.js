const mongoose = require("mongoose");
const USER_TYPE = require("../Utils/enums");

const userSchema = new mongoose.Schema(
  {
    userType: {
      type: Number,
      required: true,
      enum: Object.values(USER_TYPE),
    },
    userId: {
      type: String,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      minLength: [3, "First Name must have at least 3 characters"],
    },
    middleName: {
      type: String,
      required: false,
    },

    lastName: {
      type: String,
      required: false,
    },

    mobileNo: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return validatePhoneNumber(v);
        },
        message: (props) => `${props.value} is not a valid phone number`,
      },
    },
    mailId: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return validateEmailFormat(v);
        },
        message: (props) => `${props.value} is not a valid email`,
      },
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password must be at least 8 characters"],
      validate: {
        validator: function (v) {
          return validatePassword(v);
        },
        message: () => `Password is not valid`,
      },
    },
    tc: {
      type: Boolean,
      required: true,
    },
  }
);

function validatePhoneNumber(phone) {
  const phoneRegex = /^[6-9][0-9]{9}$/;
  return phoneRegex.test(phone);
}

function validateEmailFormat(email) {
  const regex = /^[a-zA-Z0-9.+_-]+@gmail\.com$/;
  return regex.test(email);
}

function validatePassword(password) {
  const strongPasswordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  return strongPasswordRegex.test(password);
}

const UserModel = mongoose.model("user", userSchema);
module.exports = { UserModel, userSchema };

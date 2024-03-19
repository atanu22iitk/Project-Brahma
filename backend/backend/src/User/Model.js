const mongoose = require("mongoose");
const { UserType, Gender, UserStatus, FileType } = require("./Utils");
const ErrorResponse = require("../Middlewares/errorHandler");

const userSchema = new mongoose.Schema({
  userType: {
    type: String,
    required: true,
    enum: Object.values(UserType),
  },
  userId: {
    type: String,
    unique: true,
  },
  profilePic: {
    type: String,
    required: true,
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
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: Object.values(Gender),
    validate: {
      validator: function (v) {
        return validateGender(v);
      },
      message: (props) => `${props.value} is not a valid gender`,
    },
  },
  mobileNo: {
    type: Number,
    required: true,
    validate: [
      {
        validator: function (v) {
          return validatePhoneNumber(v);
        },
        message: (props) => `${props.value} is not a valid phone number`,
      },
      {
        validator: async function (mobileNo) {
          if (this.userType !== UserType.DEPENDENT) {
            const count = await UserModel.countDocuments({
              mobileNo: mobileNo,
              _id: { $ne: this._id },
              userType: { $ne: UserType.DEPENDENT },
            });
            return count === 0;
          }
          return true;
        },
        message: (props) =>
          `The mobile number ${props.value} is already in use`,
      },
    ],
  },
  mailId: {
    type: String,
    required: true,
    unique: function () {
      return this.userType !== UserType.DEPENDENT;
    },
    validate: [
      {
        validator: function (v) {
          return validateEmailFormat(v);
        },
        message: (props) => `${props.value} is not a valid email`,
      },
      {
        validator: async function (email) {
          if (this.userType !== UserType.DEPENDENT) {
            const count = await UserModel.countDocuments({
              mailId: email,
              _id: { $ne: this._id },
              userType: { $ne: UserType.DEPENDENT },
            });
            return count === 0;
          }
          return true;
        },
        message: (props) =>
          `The email address ${props.value} is already in use`,
      },
    ],
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
  status: {
    type: String,
    default: UserStatus.PENDING,
    enum: Object.values(UserStatus),
  },
  tc: {
    type: Boolean,
    required: true,
  },
});

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

function validateGender(value) {
  if (value !== "MALE" || value !== "FEMALE" || value !== "OTHERS") {
    return new ErrorResponse("Gender must be MALE, FEMALE or OTHERS");
  }
}

function validateProfilePicFileType(filePath) {
  const allowedExtensions = [
    FileType.PDF,
    FileType.JPG,
    FileType.JPEG,
    FileType.PNG,
  ];
  const extension = filePath.split(".").pop().toLowerCase();
  return allowedExtensions.includes(extension);
}

const UserModel = mongoose.model("user", userSchema);
module.exports = { UserModel, userSchema };
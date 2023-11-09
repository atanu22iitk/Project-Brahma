const UserType = {
  APPLICANT: "APPLICANT",
  DEPENDENT: "DEPENDENT",
  DOCTOR: "DOCTOR",
  STAFF: "STAFF",
};

const Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHERS: "OTHERS",
};

const UserStatus = {
  PENDING: "PENDING",
  APPROVE: "APPROVE",
  REJECT: "REJECT",
  SUSPENDED: "SUSPENDED",
};

const FileType = {
  PDF: "PDF",
  JPG: "JPG",
  JPEG: "JPEG",
  PNG: "PNG",
};

module.exports = { UserType, Gender, UserStatus, FileType };

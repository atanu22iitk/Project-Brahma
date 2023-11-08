class UserType {
  static get APPLICANT() {
    return 1;
  }

  static get DEPENDENT() {
    return 2;
  }

  static get DOCTOR() {
    return 3;
  }

  static get STAFF() {
    return 4;
  }
}

class Gender {
  static get MALE() {
    return 1;
  }

  static get FEMALE() {
    return 2;
  }
}

class UserStatus {
  static get PENDING() {
    return 1;
  }

  static get APPROVE() {
    return 2;
  }

  static get REJECT() {
    return 3;
  }

  static get SUSPENDED() {
    return 4;
  }
}

module.exports = { UserType, Gender, UserStatus };

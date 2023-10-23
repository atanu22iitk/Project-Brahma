const bcrypt = require("bcrypt");

async function generateHash(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    new ErrorResponse("Error while generating hash", 500);
  }
}

async function decryptHash(plaintextPassword, hashedPassword) {
  try {
    const match = await bcrypt.compare(plaintextPassword, hashedPassword);
    return match;
  } catch (error) {
    new ErrorResponse("Error whiel decrypt password", 500);
  }
}

module.exports = { generateHash, decryptHash };

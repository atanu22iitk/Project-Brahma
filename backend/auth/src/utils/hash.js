const bcrypt = require("bcrypt");
const ErrorResponse= require("../Middlewares/errorHandler");

async function generateHash(text) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(text, salt);
    return hash;
  } catch (error) {
    throw new ErrorResponse("Error while generating hash", 500);
  }
}

async function decryptHash(plaintext, hashText) {
  try {
    const match = await bcrypt.compare(plaintext, hashText);
    return match;
  } catch (error) {
    throw new ErrorResponse("Error while decrypt text", 500);
  }
}

module.exports = { generateHash, decryptHash };

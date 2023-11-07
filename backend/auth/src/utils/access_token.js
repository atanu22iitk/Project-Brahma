require('dotenv').config();
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../Middlewares/errorHandler");
const JWT_KEY = process.env.JWT_SECRET_KEY ;


// Function to generate JWT access token
const generateAccessToken = async (id, userType, roles = {}) => {
  if ((userType === 3 || userType === 4) && Object.keys(roles).length === 0) {
    throw new Error("Role is required for doctors and staff");
  }

//   const header = {'typ': 'JWT', 'alg': 'HS256'};
const payload = {
    'aud': id,
    userType,
    roles,
    'exp': 604800
  };
  
  if (!payload) {
    throw new ErrorResponse(
      "Error while generate payload inside generate access token",
      400
    );
  }

  if (!JWT_KEY) {
    throw new ErrorResponse(
      "Error while generate secret key inside generate access token",
      400
    );
  }

  const token = await jwt.sign(payload, JWT_KEY);
  if (!token) {
    throw new ErrorResponse(
      "Error while generate token inside generate access token",
      400
    );
  }
  return token;
};

// Function to verify JWT access token
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  console.log("verifyToken", verifyToken);

  if (typeof authHeader !== "undefined") {
    const bearerToken = authHeader.split(" ")[1];

    jwt.verify(bearerToken, JWT_KEY, (error, payload) => {
      if (error) {
        return next(new ErrorResponse("Token is invalid or expired", 403));
      }
      req.payload = payload;
      next();
    });
  } else {
    res.send(new ErrorResponse("Token not given", 403));
  }
};

// Function to generate JWT refresh access token
const generateRefreshToken = async (id, userType, roles = {}) => {
  if ((userType === 3 || userType === 4) && Object.keys(roles).length === 0) {
    throw new ErrorResponse("Role is required for doctors and staff");
  }

  const payload = {
    sub: id,
    userType,
    roles,
    'exp': 2628000
  };
  if (!payload) {
    throw new ErrorResponse(
      "Error while generate payload inside generate refresh token",
      400
    );
  }

  if (!JWT_KEY) {
    throw new ErrorResponse(
      "Error while generate secret key inside generate refresh token",
      400
    );
  }

  const generateRefreshToken = jwt.sign(payload, JWT_KEY);
  if(!generateRefreshToken) {
    throw new ErrorResponse("Error while generate refresh token", 400);
  }
  return generateRefreshToken;
};

module.exports = { generateAccessToken, verifyToken, generateRefreshToken };

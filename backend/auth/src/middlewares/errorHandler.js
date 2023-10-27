class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  static handleError = async (err, req, res, next) => {
    const errorStatus = err.status ? err.status : 500;
    return res.status(errorStatus).json({
      success: false,
      status: errorStatus,
      stack: err.stack,
    });
  };
}

module.exports = {ErrorResponse};

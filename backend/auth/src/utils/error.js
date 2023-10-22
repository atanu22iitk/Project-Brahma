class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode <= 500 ? 'success' : 'fail';
        Error.captureStackTrace(this, this.constructor);
        Object.setPrototypeOf(this, ErrorResponse.prototype);
    }
}

module.exports = ErrorResponse;
class ErrorHandler extends Error {
    contructor(status, message){
        this.status = status
        this.message = message
    }

}

const handleError = async (err, req, res, next) => {
    const statusCode = err.statusCode ? err.statusCode : 500
    const message = err.message? err.message : 'Internal Server Error'

    if (statusCode === 500) {
        res.status(statusCode).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    } else {
        res.status(statusCode).json({
            status: 'error',
            message
        });
    }
}

module.exports = {
    ErrorHandler,
    handleError
};
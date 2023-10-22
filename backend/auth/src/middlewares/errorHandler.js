const handleError = async (err, req, res, next) => {
    const errorStatus = err.status ? err.status : 500;
    const errorMessage = err.message ? err.message : "Something went wrong!";
    return res.status(errorStatus).json({
      success: false,
      status: errorStatus,
      message: errorMessage,
      stack: err.stack,
    });
}


module.exports = handleError;
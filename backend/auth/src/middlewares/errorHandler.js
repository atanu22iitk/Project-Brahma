const handleError = async (err, req, res, next) => {
  const errorStatus = err.status ? err.status : 500;
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    stack: err.stack,
  });
};

module.exports = handleError;

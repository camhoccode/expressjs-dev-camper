const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  const error = { ...err };
  error.message = err.message;
  if (error.name === "Error") {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 400);
  }
  if (error.name === "ValidationError") {
    const message = `Duplicate field value`;
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    errorMsg: error.message || error._message,
    error: error,
  });
};

module.exports = errorHandler;

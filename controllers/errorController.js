const AppError = require("../utils/appError");

const sendErrorDev = (err, req, res) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("UNEXPECTED ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

// Normalize known error shapes into AppError
const handleAxiosError = (err) => {
  if (err.isAxiosError) {
    const status =
      err.response && err.response.status ? err.response.status : 502;
    const message =
      err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : err.message;
    return new AppError(message, status);
  }
  return err;
};

const handleSyntaxError = (err) => {
  if (err instanceof SyntaxError && err.message.includes("JSON")) {
    return new AppError("Invalid JSON payload", 400);
  }
  return err;
};

module.exports = (err, req, res, next) => {
  let error = err;

  // ensure code defaults
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  // normalize
  error = handleAxiosError(error);
  error = handleSyntaxError(error);

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, req, res);
  } else {
    sendErrorProd(error, req, res);
  }
};

function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || "Internal server error";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((item) => item.message).join(", ");
  }
  if (err.code === 11000) {
    statusCode = 409;
    message = "An account with this email already exists.";
  }
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID.";
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {})
  });
}

module.exports = { notFound, errorHandler };

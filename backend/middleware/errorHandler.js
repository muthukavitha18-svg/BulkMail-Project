const logger = require("../utils/logger")

function notFoundHandler(req, res) {
  logger.warn("Route not found", { method: req.method, path: req.originalUrl })

  res.status(404).json({
    success: false,
    error: "NOT_FOUND",
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  })
}

function errorHandler(err, req, res, next) {
  logger.error("Unhandled server error", {
    method: req.method,
    path: req.originalUrl,
    error: err.message,
  })

  res.status(500).json({
    success: false,
    error: "SERVER_ERROR",
    message: "Something went wrong on the server.",
  })
}

module.exports = { notFoundHandler, errorHandler }

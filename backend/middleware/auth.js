const jwt = require("jsonwebtoken")
const logger = require("../utils/logger")

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn("Unauthorized request - missing token")
    return res.status(401).json({
      success: false,
      error: "UNAUTHORIZED",
      message: "Login required to access this resource.",
    })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.admin = decoded
    next()
  } catch (error) {
    logger.warn("Unauthorized request - invalid token", { error: error.message })
    return res.status(401).json({
      success: false,
      error: "UNAUTHORIZED",
      message: "Invalid or expired session. Please login again.",
    })
  }
}

module.exports = authMiddleware

const express = require("express")
const jwt = require("jsonwebtoken")
const logger = require("../utils/logger")

const router = express.Router()

router.post("/login", function (req, res) {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: "VALIDATION_ERROR",
      message: "Username and password are required.",
    })
  }

  const adminUsername = process.env.ADMIN_USERNAME || "admin"
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123"

  if (username !== adminUsername || password !== adminPassword) {
    logger.warn("Failed login attempt", { username })
    return res.status(401).json({
      success: false,
      error: "INVALID_CREDENTIALS",
      message: "Invalid username or password.",
    })
  }

  const token = jwt.sign(
    { username: adminUsername, role: "admin" },
    process.env.JWT_SECRET || "bulkmail_secret",
    { expiresIn: "8h" }
  )

  logger.info("Admin logged in", { username: adminUsername })

  return res.status(200).json({
    success: true,
    message: "Login successful.",
    data: { token, username: adminUsername },
  })
})

module.exports = router

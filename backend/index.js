require("dotenv").config()

const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")
const mailRoutes = require("./routes/mailRoutes")
const authRoutes = require("./routes/authRoutes")
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler")
const logger = require("./utils/logger")

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use(function (req, res, next) {
  logger.info("Incoming request", { method: req.method, path: req.originalUrl })
  next()
})

app.get("/health", function (req, res) {
  res.status(200).json({
    success: true,
    message: "Bulk Mail API is running.",
  })
})

app.use("/auth", authRoutes)
app.use("/", mailRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

connectDB().then(function () {
  app.listen(PORT, function () {
    logger.info(`Server started on port ${PORT}`)
  })
})

const mongoose = require("mongoose")
const logger = require("../utils/logger")

async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bulkmail"

  try {
    await mongoose.connect(uri)
    logger.info("MongoDB connected", { uri: uri.replace(/\/\/.*@/, "//***@") })
  } catch (error) {
    logger.error("MongoDB connection failed", { error: error.message })
    process.exit(1)
  }
}

module.exports = connectDB

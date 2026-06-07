const mongoose = require("mongoose")

const emailSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    recipients: { type: [String], required: true },
    status: { type: String, enum: ["success", "failed"], required: true },
    messageId: { type: String },
    errorMessage: { type: String },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Email", emailSchema)

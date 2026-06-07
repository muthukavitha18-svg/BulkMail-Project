const express = require("express")
const nodemailer = require("nodemailer")
const Email = require("../models/Email")
const authMiddleware = require("../middleware/auth")
const logger = require("../utils/logger")
const { validateMailPayload } = require("../utils/validateMail")

const router = express.Router()

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 20000,
})

function sendMailWithTimeout(mailOptions, timeoutMs = 30000) {
  return Promise.race([
    transporter.sendMail(mailOptions),
    new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error("Email send timed out. Check Gmail App Password on Render."))
      }, timeoutMs)
    }),
  ])
}

transporter.verify(function (error) {
  if (error) {
    logger.error("Mail transporter verification failed", { error: error.message })
  } else {
    logger.info("Mail transporter is ready to send emails")
  }
})

router.get("/emails/history", authMiddleware, async function (req, res) {
  try {
    const emails = await Email.find()
      .sort({ createdAt: -1 })
      .select("subject body recipients status messageId errorMessage createdAt")

    logger.info("Fetched email history", { count: emails.length })

    return res.status(200).json({
      success: true,
      message: "Email history fetched successfully.",
      data: emails,
    })
  } catch (error) {
    logger.error("Failed to fetch email history", { error: error.message })
    return res.status(500).json({
      success: false,
      error: "FETCH_FAILED",
      message: "Failed to fetch email history.",
    })
  }
})

router.post("/sendmail", authMiddleware, async function (req, res) {
  const { subject, msg, recipients } = req.body

  logger.info("Received send mail request", {
    subject: subject?.trim(),
    recipientCount: Array.isArray(recipients) ? recipients.length : 0,
  })

  const validationError = validateMailPayload({ subject, msg, recipients })
  if (validationError) {
    logger.warn("Send mail validation failed", { message: validationError.message })
    return res.status(400).json({
      success: false,
      error: validationError.error,
      message: validationError.message,
    })
  }

  const trimmedSubject = subject.trim()
  const trimmedBody = msg.trim()

  try {
    const info = await sendMailWithTimeout({
      from: process.env.EMAIL_USER,
      to: recipients,
      subject: trimmedSubject,
      text: trimmedBody,
    })

    await Email.create({
      subject: trimmedSubject,
      body: trimmedBody,
      recipients,
      status: "success",
      messageId: info.messageId,
    })

    logger.info("Email sent and saved to database", {
      messageId: info.messageId,
      recipientCount: recipients.length,
    })

    return res.status(200).json({
      success: true,
      message: `Successfully sent email to ${recipients.length} recipient(s).`,
      data: {
        messageId: info.messageId,
        recipientCount: recipients.length,
      },
    })
  } catch (error) {
    await Email.create({
      subject: trimmedSubject,
      body: trimmedBody,
      recipients,
      status: "failed",
      errorMessage: error.message,
    })

    logger.error("Failed to send email", { error: error.message })

    return res.status(500).json({
      success: false,
      error: "SEND_FAILED",
      message: "Failed to send emails. Please check your mail settings.",
    })
  }
})

module.exports = router

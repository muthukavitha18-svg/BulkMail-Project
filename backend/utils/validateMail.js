const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateMailPayload({ subject, msg, recipients }) {
  if (!subject || !String(subject).trim()) {
    return { error: "VALIDATION_ERROR", message: "Subject is required." }
  }

  if (!msg || !String(msg).trim()) {
    return { error: "VALIDATION_ERROR", message: "Email body is required." }
  }

  if (!Array.isArray(recipients) || recipients.length === 0) {
    return {
      error: "VALIDATION_ERROR",
      message: "At least one recipient email is required.",
    }
  }

  const invalidEmails = recipients.filter((email) => !EMAIL_REGEX.test(email))
  if (invalidEmails.length > 0) {
    return {
      error: "VALIDATION_ERROR",
      message: `Invalid email(s): ${invalidEmails.join(", ")}`,
    }
  }

  return null
}

module.exports = { validateMailPayload }

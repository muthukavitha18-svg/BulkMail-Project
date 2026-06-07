import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function parseRecipients(input: string): string[] {
  return [...new Set(
    input
      .split(/[,;\n]+/)
      .map((email) => email.trim())
      .filter(Boolean)
  )]
}

export default function SendMail() {
  const [subject, setSubject] = useState("")
  const [msg, setmsg] = useState("")
  const [recipients, setRecipients] = useState("")
  const [errors, setErrors] = useState<{ subject?: string; msg?: string; recipients?: string }>({})
  const [status, setStatus] = useState("Ready")
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [sending, setSending] = useState(false)
  const { logout, username } = useAuth()

  const recipientList = parseRecipients(recipients)
  const invalidEmails = recipientList.filter((email) => !EMAIL_REGEX.test(email))

  function handleSubject(evt: React.ChangeEvent<HTMLInputElement>) {
    setSubject(evt.target.value)
    setErrors((prev) => ({ ...prev, subject: undefined }))
    setFeedback(null)
  }

  function handlemsg(evt: React.ChangeEvent<HTMLTextAreaElement>) {
    setmsg(evt.target.value)
    setErrors((prev) => ({ ...prev, msg: undefined }))
    setFeedback(null)
  }

  function handleRecipients(evt: React.ChangeEvent<HTMLTextAreaElement>) {
    setRecipients(evt.target.value)
    setErrors((prev) => ({ ...prev, recipients: undefined }))
    setFeedback(null)
  }

  function validate() {
    const nextErrors: typeof errors = {}

    if (!subject.trim()) {
      nextErrors.subject = "Subject is required."
    }

    if (!msg.trim()) {
      nextErrors.msg = "Email body is required."
    }

    if (recipientList.length === 0) {
      nextErrors.recipients = "Enter at least one recipient email."
    } else if (invalidEmails.length > 0) {
      nextErrors.recipients = `Invalid email(s): ${invalidEmails.join(", ")}`
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function sent() {
    setFeedback(null)

    if (!validate()) {
      setStatus("Validation failed")
      return
    }

    setSending(true)
    setStatus("Sending...")

    try {
      const response = await api.post("/sendmail", {
        subject: subject.trim(),
        msg: msg.trim(),
        recipients: recipientList,
      })

      setFeedback({ type: "success", message: response.data.message })
      setStatus("Sent")
    } catch (error) {
      let message = "Failed to send emails. Please try again."

      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          message = "Request timed out. Render server may be waking up — wait 1 minute and try again."
        } else if (error.response?.data?.message) {
          message = error.response.data.message
        } else if (!error.response) {
          message = "Cannot reach server. Wait 30–60 seconds (Render cold start) and try again."
        }
      }

      setFeedback({ type: "error", message })
      setStatus("Failed")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-500 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">

        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-4xl font-bold text-white">Bulk Mail</h1>
            <p className="text-gray-200 mt-1">Welcome, {username}</p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/history"
              className="px-5 py-2 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition"
            >
              History
            </Link>
            <button
              onClick={logout}
              className="px-5 py-2 rounded-xl bg-red-500/80 text-white hover:bg-red-500 transition"
            >
              Logout
            </button>
          </div>
        </div>

        <p className="text-center text-gray-200 mt-3">
          Send personalized emails to thousands of users in one click
        </p>

        {sending && (
          <p className="text-center text-blue-200 text-sm mt-3">
            First send may take 30–60 seconds while the server wakes up...
          </p>
        )}

        {feedback && (
          <div
            className={`mt-6 p-4 rounded-xl text-center font-medium ${
              feedback.type === "success"
                ? "bg-green-500/20 text-green-200 border border-green-400/40"
                : "bg-red-500/20 text-red-200 border border-red-400/40"
            }`}
          >
            {feedback.message}
          </div>
        )}

        <div className="mt-8">
          <label htmlFor="subject" className="text-white font-medium">
            Subject
          </label>

          <input
            id="subject"
            type="text"
            value={subject}
            onChange={handleSubject}
            placeholder="Enter email subject..."
            className="w-full mt-2 p-4 rounded-xl bg-white text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-300">{errors.subject}</p>
          )}
        </div>

        <div className="mt-6">
          <label htmlFor="emailBody" className="text-white font-medium">
            Email Body
          </label>

          <textarea
            id="emailBody"
            value={msg}
            onChange={handlemsg}
            rows={8}
            placeholder="Type your email content here..."
            className="w-full mt-2 p-4 rounded-xl bg-white text-gray-700 outline-none resize-y focus:ring-2 focus:ring-indigo-400"
          />
          {errors.msg && (
            <p className="mt-1 text-sm text-red-300">{errors.msg}</p>
          )}
        </div>

        <div className="mt-6">
          <label htmlFor="recipients" className="text-white font-medium">
            Recipient Emails
          </label>

          <textarea
            id="recipients"
            value={recipients}
            onChange={handleRecipients}
            rows={4}
            placeholder="Enter emails separated by comma or new line&#10;e.g. user1@email.com, user2@email.com"
            className="w-full mt-2 p-4 rounded-xl bg-white text-gray-700 outline-none resize-y focus:ring-2 focus:ring-indigo-400"
          />
          {errors.recipients && (
            <p className="mt-1 text-sm text-red-300">{errors.recipients}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-6">

          <div className="bg-white/10 rounded-xl p-5 text-center">
            <h3 className="text-white text-lg">
              Total Emails
            </h3>

            <p className="text-4xl font-bold text-green-400 mt-2">
              {recipientList.length}
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-5 text-center">
            <h3 className="text-white text-lg">
              Status
            </h3>

            <p className={`text-2xl font-semibold mt-2 ${
              status === "Sent" ? "text-green-300"
                : status === "Failed" || status === "Validation failed" ? "text-red-300"
                : status === "Sending..." ? "text-blue-300"
                : "text-yellow-300"
            }`}>
              {status}
            </p>
          </div>

        </div>

        <button
          onClick={sent}
          disabled={sending}
          className="w-full mt-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 transition py-4 rounded-xl text-white font-bold text-lg shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {sending ? "Sending..." : "Send Bulk Emails"}
        </button>

      </div>
    </div>
  )
}

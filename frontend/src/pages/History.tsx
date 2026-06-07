import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"

type EmailRecord = {
  _id: string
  subject: string
  body: string
  recipients: string[]
  status: "success" | "failed"
  messageId?: string
  errorMessage?: string
  createdAt: string
}

export default function History() {
  const [emails, setEmails] = useState<EmailRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { logout, username } = useAuth()

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await api.get("/emails/history")
        setEmails(response.data.data)
      } catch (err) {
        setError("Failed to load email history.")
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-500 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Email History</h1>
            <p className="text-gray-200 mt-1">Welcome, {username}</p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/"
              className="px-5 py-2 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition"
            >
              Send Mail
            </Link>
            <button
              onClick={logout}
              className="px-5 py-2 rounded-xl bg-red-500/80 text-white hover:bg-red-500 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {loading && (
          <p className="text-center text-white text-lg">Loading history...</p>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-500/20 text-red-200 border border-red-400/40 text-center">
            {error}
          </div>
        )}

        {!loading && !error && emails.length === 0 && (
          <div className="bg-white/10 rounded-2xl p-10 text-center text-white border border-white/20">
            No emails sent yet.
          </div>
        )}

        <div className="space-y-4">
          {emails.map((email) => (
            <div
              key={email._id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">{email.subject}</h2>
                  <p className="text-sm text-gray-300 mt-1">
                    {new Date(email.createdAt).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    email.status === "success"
                      ? "bg-green-500/20 text-green-200 border border-green-400/40"
                      : "bg-red-500/20 text-red-200 border border-red-400/40"
                  }`}
                >
                  {email.status === "success" ? "Success" : "Failed"}
                </span>
              </div>

              <p className="text-gray-200 mt-4 line-clamp-2">{email.body}</p>

              <p className="text-sm text-gray-300 mt-3">
                Recipients ({email.recipients.length}): {email.recipients.join(", ")}
              </p>

              {email.errorMessage && (
                <p className="text-sm text-red-300 mt-2">Error: {email.errorMessage}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

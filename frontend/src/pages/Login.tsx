import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import { API_URL } from "../api/axios"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/auth/login`, { username, password })
      login(response.data.data.token, response.data.data.username)
      navigate("/")
    } catch (err) {
      let message = "Login failed. Please try again."

      if (axios.isAxiosError(err)) {
        if (!err.response) {
          message = "Cannot connect to server. Wait 30 sec and try again (Render cold start)."
        } else if (err.response.data?.message) {
          message = err.response.data.message
        }
      }

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-500 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
        <h1 className="text-3xl font-bold text-center text-white">Admin Login</h1>
        <p className="text-center text-gray-200 mt-2">Sign in to manage bulk emails</p>
        <p className="text-center text-gray-300 text-sm mt-2">
          Default: admin / admin123
        </p>

        {error && (
          <div className="mt-6 p-4 rounded-xl text-center font-medium bg-red-500/20 text-red-200 border border-red-400/40">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="username" className="text-white font-medium">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(evt) => setUsername(evt.target.value)}
              placeholder="Enter username"
              className="w-full mt-2 p-4 rounded-xl bg-white text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="text-white font-medium">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(evt) => setPassword(evt.target.value)}
              placeholder="Enter password"
              className="w-full mt-2 p-4 rounded-xl bg-white text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:scale-105 transition py-4 rounded-xl text-white font-bold text-lg shadow-lg disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  )
}

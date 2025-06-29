import { useState } from "react"
import { POST } from "../api/index"
import { AuthStatus } from "context/AuthContext"

function Login({ authContext }: { authContext: any }) {
  const [form, setState] = useState({
    username: "",
    password: "",
  })

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (form.username && form.password) {
      POST("/login", form, () => {
        authContext.setAuthContext({
          user: null,
          status: AuthStatus.AUTHORIZED,
        })
      })
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setState({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username / Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username or Email
          </label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Sign In
        </button>
      </form>
      <div className="mt-4 text-center text-sm text-gray-600">
        <span>Dont have an account?</span>
        <a
          href="/register"
          className="ml-1 font-medium text-blue-600 hover:underline"
        >
          Register
        </a>
      </div>
    </div>
  )
}

export default Login

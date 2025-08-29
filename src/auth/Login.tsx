import { useState } from "react"
import { AuthStatus } from "context/AuthContext"
import { IoEye, IoEyeOff } from "react-icons/io5"
import httpClient from "utils/httpClient"
import { useNavigate } from "react-router"

export const login = (credentials: any) =>
  httpClient.post("/login", credentials)

export const useAuth = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (credentials: any) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await login(credentials)
      localStorage.setItem("token", data.token) // store JWT
      return data // caller decides what to do (redirect, etc.)
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { handleLogin, loading, error }
}

function Login({ authContext }: { authContext: any }) {
  const navigate = useNavigate()
  const { handleLogin } = useAuth()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [state, setState] = useState({
    showPassword: false,
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      await handleLogin(formData)
      authContext.setAuthContext({
        user: null,
        status: AuthStatus.AUTHORIZED,
      })
      navigate("/") // redirect after login
    } catch {
      /* error handled in hook */
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username / Email Input */}
        <div>
          <label className="block text-sm mb-2">Username or Email</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Password</label>
          <div className="relative">
            <input
              name="password"
              type={state.showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Show eye icon only when typing */}
            {formData.password.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  setState({ ...state, showPassword: !state.showPassword })
                }
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {state.showPassword ? (
                  <IoEyeOff className="w-5 h-5" />
                ) : (
                  <IoEye className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
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

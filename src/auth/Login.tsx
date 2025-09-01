import { useState } from "react"
import { AuthStatus } from "context/AuthContext"
import { IoEye, IoEyeOff } from "react-icons/io5"
import { useNavigate } from "react-router"
import { useLogin } from "hooks/auth"

function Login({ authContext }: { authContext: any }) {
  const navigate = useNavigate()
  const { handleLogin } = useLogin()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [state, setState] = useState({
    showPassword: false,
  })

  const validate = () => {
    if (
      formData.username &&
      formData.password &&
      formData.password.length >= 6
    ) {
      return true
    }
    return false
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      if (validate()) {
        const user = await handleLogin(formData)
        authContext.setAuthContext({
          user,
          status: AuthStatus.AUTHORIZED,
        })
        navigate("/") // redirect after login
      }
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
      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
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
            autoComplete="username"
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
              autoComplete="password"
              required
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

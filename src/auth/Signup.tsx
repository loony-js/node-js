import { useState } from "react"
import { IoEye, IoEyeOff } from "react-icons/io5"
import { useSignup } from "hooks/auth"
import { useNavigate } from "react-router"

const Signup = () => {
  const navigate = useNavigate()
  const { handleSignup } = useSignup()
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    username: "",
    password: "",
    confirm_password: "",
  })

  const [state, setState] = useState({
    showPassword: false,
    showConfirmPassword: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const validate = () => {
    if (
      formData.username &&
      formData.fname &&
      formData.password &&
      formData.password.length >= 6 &&
      formData.confirm_password &&
      formData.password === formData.confirm_password
    ) {
      return true
    }
    return false
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (validate()) {
      try {
        handleSignup(formData)
        navigate("/login")
      } catch {
        console.log("Login failed.")
      }
    }
  }

  return (
    <div className="flex-1 min-h-screen ml-64 bg-stone-50 dark:bg-[#212121] pt-16">
      <div className="w-[45%] mx-auto">
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Signup</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username or Email
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First name
              </label>
              <input
                type="text"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last name
              </label>
              <input
                type="text"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password Input */}
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

            <div>
              <label className="block text-sm mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  name="confirm_password"
                  type={state.showConfirmPassword ? "text" : "password"}
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Show eye icon only when typing */}
                {formData.confirm_password.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setState({
                        ...state,
                        showConfirmPassword: !state.showConfirmPassword,
                      })
                    }
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {state.showConfirmPassword ? (
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
              Register
            </button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-600">
            <span>Have an account?</span>
            <a
              href="/login"
              className="ml-1 font-medium text-blue-600 hover:underline"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup

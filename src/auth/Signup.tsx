import { useState } from "react"
import { POST } from "../api/index"

const Signup = () => {
  const [form, setFormData] = useState({
    fname: "",
    lname: "",
    username: "",
    password: "",
    confirm_password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...form, [name]: value })
  }

  const handleSubmit = () => {
    if (
      form.username &&
      form.fname &&
      form.password &&
      form.confirm_password &&
      form.password === form.confirm_password
    ) {
      POST("/register", form, () => {})
    }
  }

  return (
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
            value={form.username}
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
            value={form.fname}
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
            value={form.lname}
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirm_password"
            value={form.confirm_password}
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
  )
}

export default Signup

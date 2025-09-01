import { useState } from "react"
import { decryptText } from "../api/index"
import { IoEye, IoEyeOff } from "react-icons/io5"

function Decrypt() {
  const [formData, setFormData] = useState({
    password: "",
    master_password: "",
  })
  const [state, setState] = useState({
    decryptedValue: "",
    showPassword: false,
  })

  const validate = () => {
    if (formData.password && formData.master_password) {
      return true
    } else {
      return false
    }
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (validate()) {
      decryptText(formData).then(({ data }: any) => {
        setState({
          ...state,
          decryptedValue: data.password,
        })
      })
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    let paste = (e.clipboardData || window.Clipboard).getData("text")
    paste = paste.trimEnd()
    setFormData({
      ...formData,
      password: paste,
    })
  }

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg">
        <div>
          <label className="block text-sm mb-2">Password</label>
          <div className="relative">
            <input
              name="password"
              type="text"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onPaste={handlePaste}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2">Master Password</label>
          <div className="relative">
            <input
              name="master_password"
              type={state.showPassword ? "text" : "password"}
              value={formData.master_password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Show eye icon only when typing */}
            {formData.master_password.length > 0 && (
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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </form>
      <div>{state.decryptedValue}</div>
    </div>
  )
}

export default Decrypt

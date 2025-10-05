import { useContext, useState } from "react"
import { encryptText } from "../api/index"
import { Facebook, Instagram, Gmail } from "../Icons/index"
import { IoEye, IoEyeOff } from "react-icons/io5"
import { AuthContext } from "context/AuthContext"

const domains = [
  { name: "Facebook", icon: <Facebook />, url: "https://facebook.com" },
  { name: "Gmail", icon: <Gmail />, url: "https://gmail.com" },
  { name: "Instagram", icon: <Instagram />, url: "https://instagram.com" },
]

function Encrypt() {
  const { user } = useContext(AuthContext)

  const [formData, setFormData] = useState({
    name: "",
    url: "",
    username: "",
    password: "",
    master_password: "",
  })

  const [state, setState] = useState({
    showPassword: false,
    showMasterPassword: false,
  })

  const validate = () => {
    if (
      formData.name &&
      formData.username &&
      formData.password &&
      formData.master_password
    ) {
      return true
    } else {
      return false
    }
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (validate()) {
      encryptText({ ...formData, user_id: user?.uid }).then(() => {})
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
    <div>
      <div className="flex flex-row py-2">
        {domains.map((domain, index) => {
          return (
            <div
              key={index}
              className="w-18 h-18 border border-gray-300 p-2 rounded-xl mr-2"
              onClick={() => {
                setFormData({
                  ...formData,
                  url: domain.url,
                  name: domain.name,
                })
              }}
            >
              {domain.icon}
            </div>
          )
        })}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg">
        <div>
          <label className="block text-sm mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Url</label>
          <input
            type="text"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-2">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        <div>
          <label className="block text-sm mb-2">Master Password</label>
          <div className="relative">
            <input
              name="master_password"
              type={state.showMasterPassword ? "text" : "password"}
              value={formData.master_password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Show eye icon only when typing */}
            {formData.master_password.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  setState({
                    ...state,
                    showMasterPassword: !state.showMasterPassword,
                  })
                }
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {state.showMasterPassword ? (
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
    </div>
  )
}

export default Encrypt

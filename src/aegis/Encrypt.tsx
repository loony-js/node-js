import { useState } from "react"
import { POST } from "../api/index"
import { Facebook, Instagram, Gmail } from "../Icons/index"

const domains = [
  { name: "Facebook", icon: <Facebook />, url: "https://facebook.com" },
  { name: "Gmail", icon: <Gmail />, url: "https://gmail.com" },
  { name: "Instagram", icon: <Instagram />, url: "https://instagram.com" },
]

function Encrypt() {
  const [form, setState] = useState({
    name: "",
    url: "",
    username: "",
    password: "",
    master_password: "",
  })

  const handleSubmit = (e: any) => {
    e.preventDefault()
    POST("/aegis/encrypt", form, () => {})
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setState({
      ...form,
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
                setState({
                  ...form,
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
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-4 bg-gray-100 rounded-lg"
      >
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter name"
          className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="text"
          name="url"
          value={form.url}
          onChange={handleChange}
          placeholder="Enter url"
          className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Enter username"
          className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="text"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter password"
          className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          name="master_password"
          value={form.master_password}
          onChange={handleChange}
          placeholder="Enter master password"
          className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

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

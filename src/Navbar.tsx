import { logout } from "api"
import { AuthStatus } from "context/AuthContext"
import { useState } from "react"
import { useNavigate } from "react-router"

const Navbar = ({ authContext }: { authContext: any }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="w-[60%] mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="text-xl font-bold text-gray-900">
          Loony
        </a>

        {/* Hamburger button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Menu */}
        <div
          className={`md:flex md:items-center ${isOpen ? "block" : "hidden"}`}
        >
          {authContext.status === AuthStatus.AUTHORIZED ? (
            <AuthNavRight authContext={authContext} />
          ) : (
            <NotAuthNavRight />
          )}
        </div>
      </div>
    </nav>
  )
}

const AuthNavRight = ({ authContext }: { authContext: any }) => {
  const navigate = useNavigate()
  const onLogout = () => {
    try {
      logout()
      authContext.setAuthContext({
        user: null,
        status: AuthStatus.UNAUTHORIZED,
      })
      navigate("/login")
    } catch {
      console.log("Logout failed.")
    }
  }

  return (
    <>
      <ul className="flex flex-col md:flex-row md:space-x-6 mt-3 md:mt-0">
        <li>
          <a href="#" className="block py-2 text-gray-700 hover:text-blue-600">
            Home
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              onLogout()
            }}
            className="block py-2 text-gray-700 hover:text-blue-600"
          >
            Logout
          </a>
        </li>
      </ul>
    </>
  )
}

const NotAuthNavRight = () => {
  return (
    <>
      <ul className="flex flex-col md:flex-row md:space-x-6 mt-3 md:mt-0">
        <li>
          <a
            href="/login"
            className="block py-2 text-gray-700 hover:text-blue-600"
          >
            Login
          </a>
        </li>
      </ul>
    </>
  )
}

export default Navbar

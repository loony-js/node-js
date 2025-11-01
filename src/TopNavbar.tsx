/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useNavigate, NavigateFunction } from "react-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { AuthStatus } from "loony-types"
import { useLogout } from "loony-web-api"
import type { AppContextProps, AuthContextProps } from "loony-types"
import { Menu } from "lucide-react"
import {} from "./"

const TopNavbar = ({
  authContext,
  appContext,
  setMobileNavOpen,
}: {
  appContext: AppContextProps
  authContext: AuthContextProps
  setMobileNavOpen: any
}) => {
  const navigate: NavigateFunction = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const { onLogout } = useLogout()

  const onLogoutSuccess = useCallback(() => {
    authContext.setAuthContext({
      status: AuthStatus.UNAUTHORIZED,
      user: null,
    })
    navigate("/", { replace: true })
  }, [authContext, navigate])

  const onLogoutError = () => {}

  const logoutUser = useCallback(() => {
    onLogout(onLogoutSuccess, onLogoutError)
  }, [onLogout, onLogoutSuccess])

  return (
    <nav className="flex fixed w-full h-16 py-auto">
      {/* Logo */}
      <div className="flex items-center w-72 px-4 bg-white dark:bg-[#131313] text-black dark:text-white">
        {/* <Menu
          className="block lg:hidden mr-2"
          onClick={() => {
            setMobileNavOpen((prevState: boolean) => !prevState)
          }}
        /> */}
        <a href="/" className="text-xl font-bold">
          Loony
        </a>
      </div>

      {/* Menu */}
      <div className="flex-1 flex items-center justify-end bg-gray-50 dark:bg-[#212121] text-black dark:text-white hidden md:flex md:items-center pr-10 py-2 px-4">
        {authContext.status === AuthStatus.AUTHORIZED ? (
          <AuthNavRight logoutUser={logoutUser} />
        ) : (
          <NotAuthNavRight />
        )}
      </div>
    </nav>
  )
}

const AuthNavRight = ({ logoutUser }: any) => {
  return (
    <>
      <ul className="flex flex-col md:flex-row md:space-x-6 mt-3 md:mt-0">
        <li>
          <a href="#" onClick={logoutUser} className="block py-2">
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
          <a href="/login" className="block py-2">
            Login
          </a>
        </li>
      </ul>
    </>
  )
}

const ActivityButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<any>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  return (
    <li className="relative" ref={dropdownRef}>
      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-stone-100 hover:bg-stone-200 dark:bg-[#2e2e2e] hover:dark:bg-[#363636] rounded-sm transition duration-200"
      >
        Create
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md px-1 bg-white dark:bg-[#2e2e2e] shadow-xl ring-1 ring-gray-200 dark:ring-gray-900 z-50 animate-fade-in">
          <ul className="py-2 text-sm">
            <li>
              <a
                href="/create/book"
                className="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#4d4d4d] transition duration-150"
              >
                Book
              </a>
            </li>
            <li>
              <a
                href="/create/blog"
                className="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#4d4d4d] transition duration-150"
              >
                Blog
              </a>
            </li>
          </ul>
        </div>
      )}
    </li>
  )
}

export default TopNavbar

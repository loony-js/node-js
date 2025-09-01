import { login, signup } from "api"
import { useState } from "react"

export const useLogin = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (credentials: any) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await login(credentials)
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

export const useSignup = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSignup = async (credentials: any) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await signup(credentials)
      return data // caller decides what to do (redirect, etc.)
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { handleSignup, loading, error }
}

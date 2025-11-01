import { useState } from "react"
import { login, logout, register } from "./api"
import { handleError } from "./query"

export const useLogout = () => {
  const onLogout = (onSuccess, onError) => {
    logout()
      .then((res) => {
        onSuccess(res.data)
      })
      .catch((err) => {
        const appError = handleError(err)
        onError(appError)
      })
  }

  return { onLogout }
}

export const useLogin = () => {
  const [error, setError] = useState({
    label: "",
    message: "",
  })

  const onLogin = (formData, onSuccess, onError) => {
    if (!formData.username) {
      setError({
        label: "username",
        message: "Email is required.",
      })
      return
    }
    if (!formData.password) {
      setError({
        label: "password",
        message: "Password is required.",
      })
      return
    }

    login(formData)
      .then((res) => {
        onSuccess(res.data)
      })
      .catch((err) => {
        const appError = handleError(err)
        onError(appError)
      })
  }

  return { onLogin, error }
}

export const useSignup = () => {
  const [error, setError] = useState({
    label: "",
    message: "",
  })

  const onSignup = (formData, onSuccess, onError) => {
    if (!formData.username) {
      setError({
        label: "username",
        message: "Email is required.",
      })
      return
    }
    if (!formData.password) {
      setError({
        label: "password",
        message: "Password is required.",
      })
      return
    }

    if (formData.password !== formData.confirm_password) {
      setError({
        label: "confirm_password",
        message: "Password does not match.",
      })
      return
    }

    register(formData)
      .then((res) => {
        onSuccess(res.data)
      })
      .catch((err) => {
        const appError = handleError(err)
        onError(appError)
      })
  }

  return { onSignup, error }
}

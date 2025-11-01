import {
  AuthContextProps,
  NotificationContextProps,
  NotificationState,
} from "loony-types"
import { NavigateFunction } from "react-router"
import { handleError } from "./query"
import { authHttpClient } from "./httpClient"

export const onSendResetPassword = ({
  sessionId,
  formData,
  setFormError,
  notificationContext,
}: {
  sessionId
  formData: { email: string; password: string; confirmPassword: string }
  setFormError: React.Dispatch<
    React.SetStateAction<{ label: string; message: string }>
  >
  authContext: AuthContextProps
  notificationContext: NotificationContextProps
  navigate: NavigateFunction
}) => {
  if (!formData.email) {
    setFormError({
      label: "username",
      message: "Email is required.",
    })
    return
  }

  if (!formData.password) {
    setFormError({
      label: "password",
      message: "Password is required.",
    })
    return
  }

  if (!formData.confirmPassword) {
    setFormError({
      label: "confirm_password",
      message: "Confirm Password is required.",
    })
    return
  }

  if (formData.password !== formData.confirmPassword) {
    setFormError({
      label: "confirm_password",
      message: "Password does not match.",
    })
    return
  }

  authHttpClient
    .post("/reset_password", {
      session_id: sessionId,
      email: formData.email,
      password: formData.password,
      confirm_password: formData.confirmPassword,
    })
    .then(() => {
      notificationContext.setNotificationContext(
        (prevState: NotificationState) => ({
          ...prevState,
          alert: {
            title: "Success",
            content:
              "A password reset link has been sent to your email address.",
            status: "success",
          },
        }),
      )
    })
    .catch((err) => {
      const __err = handleError(err)
      notificationContext.setNotificationContext(
        (prevState: NotificationState) => ({
          ...prevState,
          alert: {
            title: "Error",
            content: __err,
            status: "error",
          },
        }),
      )
    })
}

export const onSendResetPasswordEmail = ({
  formData,
  setFormError,
  notificationContext,
}: {
  formData: { email: string }
  setFormError: React.Dispatch<
    React.SetStateAction<{ label: string; message: string }>
  >
  authContext: AuthContextProps
  notificationContext: NotificationContextProps
  navigate: NavigateFunction
}) => {
  if (!formData.email) {
    setFormError({
      label: "username",
      message: "Email is required.",
    })
    return
  }

  authHttpClient
    .post("/mail", {
      to: formData.email,
      subject: "Forgot password",
    })
    .then(() => {
      notificationContext.setNotificationContext(
        (prevState: NotificationState) => ({
          ...prevState,
          alert: {
            title: "Success",
            content:
              "A password reset link has been sent to your email address.",
            status: "success",
          },
        }),
      )
    })
    .catch((err) => {
      const __err = handleError(err)
      notificationContext.setNotificationContext(
        (prevState: NotificationState) => ({
          ...prevState,
          alert: {
            title: "Error",
            content: __err,
            status: "error",
          },
        }),
      )
    })
}

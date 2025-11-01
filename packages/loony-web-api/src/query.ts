import axios from "axios"
import config from "../../../config/app.config.json"

const appConfig: any = config
const env: string = config.NODE_ENV
const currentConfig: any = appConfig[env]
const { API_URL } = currentConfig

export const CREATE_BOOK = "/book/create"
export const CREATE_BLOG = "/blog/create"
export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

const handleBackendError = (data) => {
  if (data.email && data.email[0] && data.email[0].code) {
    return data.email[0].code
  }
  if (data.password && data.password[0] && data.password[0].code) {
    if (data.password[0].code === "length") {
      return "Password length should more then or equal to 6"
    }
  }
  return null
}

export const handleError = (err: any): string => {
  if (err.response && err.response.data && err.response.data) {
    const data = handleBackendError(err.response.data)
    if (data) {
      return data
    }
  }

  if (err.response && err.response.data && err.response.data.message) {
    return err.response.data.message
  }

  if (!err) {
    return "An unknown error occurred."
  }

  // Handle specific error codes
  switch (err.code) {
    case "ECONNABORTED":
      return "Connection aborted."
    case "ECONNREFUSED":
      return "Connection refused."
    case "ECONNRESET":
      return "Connection reset."
    case "ENOTFOUND":
      return "Server not found."
    case "ERR_NETWORK":
      return "Network error occurred."
    case "ERR_BAD_REQUEST":
      return "Bad request. Check the request parameters or payload."
    case "ERR_BAD_RESPONSE":
      return "Server responded with an invalid or unexpected payload."
    case "ERR_CANCELED":
      return "Request was canceled."
    default:
      break
  }

  // Handle Status codes
  if (err.response && err.response.status) {
    const { status } = err.response

    switch (status) {
      case 400:
        return "Bad Request (400): The server could not understand the request."
      case 401:
        return "Unauthorized (401): Authentication is required or failed."
      case 403:
        return "Forbidden (403): You do not have permission to access this resource."
      case 404:
        return "Not Found (404): The requested resource was not found."
      case 500:
        return "Internal Server Error (500): Something went wrong on the server."
      case 502:
        return "Bad Gateway (502): Invalid response received from an upstream server."
      case 503:
        return "Service Unavailable (503): The server is currently unavailable."
      case 504:
        return "Gateway Timeout (504): The server took too long to respond."
      default:
        break
    }
  }

  // Handle errors with response data
  if (typeof err === "object") {
    if (err.response?.data) {
      // If the response data is a string, return it directly
      if (typeof err.response.data === "string") {
        return err.response.data
      }

      // If the response data is an array, return it
      if (Array.isArray(err.response.data)) {
        return err.response.data.map(String) // Ensure all elements are strings
      }

      // If the response data is an object, stringify it
      if (typeof err.response.data === "object") {
        return JSON.stringify(err.response.data)
      }
    }

    // Handle generic error messages
    if (err.message) {
      return err.message
    }

    // Add stack trace if available for debugging purposes
    if (err.stack) {
      return "Stack trace: " + err.stack
    }
  }

  // Handle string errors
  if (typeof err === "string") {
    return err
  }
}

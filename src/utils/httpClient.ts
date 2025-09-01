// src/api/httpClient.js
import axios from "axios"

const httpClient = axios.create({
  baseURL: "https://localhost:2000",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

// Request interceptor
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common error cases globally
    if (error.response?.status === 401) {
      // redirect to login, refresh token, etc.
    }
    return Promise.reject(error)
  },
)

export default httpClient

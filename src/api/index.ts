import { apiHttpClient, authHttpClient } from "./httpClient"

export const getUserInfo = () => authHttpClient.get("/userInfo")

export const login = (credentials: any) =>
  authHttpClient.post("/login", credentials)

export const signup = (credentials: any) =>
  authHttpClient.post("/register", credentials)

export const logout = () => authHttpClient.post("/logout")

export const getAllCredentials = () => apiHttpClient.get("/aegis/all")
export const deleteCredential = (id: number) =>
  apiHttpClient.post("/aegis/delete/" + id)
export const encryptText = (data: any) =>
  apiHttpClient.post("/aegis/encrypt", data)
export const decryptText = (data: any) =>
  apiHttpClient.post("/aegis/decrypt", data)

// const cleanUrl = (url: string) => (url[0] === "/" ? url.slice(1) : url)

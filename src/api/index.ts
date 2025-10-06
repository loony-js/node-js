import { apiHttpClient, authHttpClient } from "./httpClient"

export const getUserInfo = () => authHttpClient.get("/user/userInfo")

export const login = (credentials: any) =>
  authHttpClient.post("/login", credentials)

export const signup = (credentials: any) =>
  authHttpClient.post("/signup", credentials)

export const logout = () => authHttpClient.post("/logout")

export const getAllCredentials = (user_id: string | number) =>
  apiHttpClient.get(`/aegis/${user_id}/all`)
export const getCredentialInfo = (aegis_id: string | number) =>
  apiHttpClient.get(`/aegis/${aegis_id}/get`)
export const deleteCredential = (id: number) =>
  apiHttpClient.post("/aegis/delete/" + id)
export const encryptText = (data: any) =>
  apiHttpClient.post("/aegis/encrypt", data)
export const decryptText = (data: any) =>
  apiHttpClient.post("/aegis/decrypt", data)

// const cleanUrl = (url: string) => (url[0] === "/" ? url.slice(1) : url)

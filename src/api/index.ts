import { apiHttpClient, authHttpClient } from "./httpClient"

export const getUserInfo = () => authHttpClient.get("/user/userInfo")

export const login = (credentials: any) =>
  authHttpClient.post("/login", credentials)

export const signup = (credentials: any) =>
  authHttpClient.post("/signup", credentials)

export const logout = () => authHttpClient.post("/logout")

export const getAllCredentialsApi = (user_id: string | number) =>
  apiHttpClient.get(`/aegis/${user_id}/all`)
export const getOneCredentialApi = (aegis_id: string | number) =>
  apiHttpClient.get(`/aegis/${aegis_id}/get`)
export const deleteOneCredentialApi = (id: number) =>
  apiHttpClient.post("/aegis/delete/" + id)
export const addOneCredentialApi = (data: any) =>
  apiHttpClient.post("/aegis/encrypt", data)
export const editOneCredentialApi = (aegis_id: number, data: any) =>
  apiHttpClient.post(`/aegis/${aegis_id}/edit`, data)
export const decryptOneCredentialApi = (data: any) =>
  apiHttpClient.post("/aegis/decrypt", data)

// const cleanUrl = (url: string) => (url[0] === "/" ? url.slice(1) : url)

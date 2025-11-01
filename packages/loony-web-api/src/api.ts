import { apiHttpClient, authHttpClient } from "./httpClient"

export const login = (creds) => authHttpClient.post("/login", creds)
export const logout = () => authHttpClient.post("/logout")
export const register = (creds) => authHttpClient.post("/signup", creds)

/** User */
export const getUserInfo = () => authHttpClient.get("/user/userInfo")

/** Home */
export const getHomeBooks = () => apiHttpClient.get(`/book/get/home_books`)
export const getHomeBlogs = () => apiHttpClient.get(`/book/get/home_books`)

export const getUsersHomeBooks = (uid: number) =>
  apiHttpClient.get(`/book/get/${uid}/get_users_book`)
export const getUsersHomeBlogs = (uid: number) =>
  apiHttpClient.get(`/blog/get/${uid}/get_users_blog`)
/** Book */
export const getBookNav = (doc_id: number) =>
  apiHttpClient.get(`/book/get/nav?doc_id=${doc_id}`)
export const getChapter = (doc_id: number, page_id: number) =>
  apiHttpClient.get(`/book/get/chapter?doc_id=${doc_id}&page_id=${page_id}`)
export const getSection = (doc_id: number, page_id: number) =>
  apiHttpClient.get(`/book/get/section?doc_id=${doc_id}&page_id=${page_id}`)

/** Blog */
export const getBlogNodes = (doc_id: number) =>
  apiHttpClient.get(`/blog/get/nodes?doc_id=${doc_id}`)

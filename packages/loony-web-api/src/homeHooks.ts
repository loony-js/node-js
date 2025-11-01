import { useCallback, useState } from "react"
import {
  getHomeBlogs,
  getHomeBooks,
  getUsersHomeBlogs,
  getUsersHomeBooks,
} from "./api"

export const useHomeBooks = () => {
  const [data, setData] = useState(null)
  const [err, setError] = useState(null)

  const fetch = useCallback(() => {
    getHomeBooks()
      .then(({ data }) => {
        setData(data)
      })
      .catch((err) => {
        console.log(err)
        setError(err)
      })
  }, [])

  return { data, err, fetch }
}

export const useHomeBlogs = () => {
  const [data, setData] = useState(null)
  const [err, setError] = useState(null)

  const fetch = useCallback(() => {
    getHomeBlogs()
      .then(({ data }) => {
        setData(data)
      })
      .catch((err) => {
        console.log(err)
        setError(err)
      })
  }, [])

  return { data, err, fetch }
}

export const useUserHomeBooks = () => {
  const [data, setData] = useState(null)
  const [err, setError] = useState(null)
  const fetch = useCallback((uid) => {
    if (uid) {
      getUsersHomeBooks(uid as number)
        .then(({ data }) => {
          setData(data)
        })
        .catch((err) => {
          console.log(err)
          setError(err)
        })
    }
  }, [])

  return { data, err, fetch }
}

export const useUserBooks = useUserHomeBooks

export const useUserHomeBlogs = () => {
  const [data, setData] = useState(null)
  const [err, setError] = useState(null)
  const fetch = useCallback((uid) => {
    if (uid) {
      getUsersHomeBlogs(uid)
        .then(({ data }) => {
          setData(data)
        })
        .catch((err) => {
          console.log(err)
          setError(err)
        })
    }
  }, [])

  return { data, err, fetch }
}

export const useUserBlogs = useUserHomeBlogs

import { useEffect, useState } from "react"
import { getBookNav, getChapter } from "./api"

export const useGetBookNav = (doc_id) => {
  const [data, setData] = useState(null)
  const [err, setError] = useState(null)
  useEffect(() => {
    getBookNav(doc_id)
      .then(({ data }) => {
        setData(data)
      })
      .catch((err) => {
        console.log(err)
        setError(err)
      })
  }, [doc_id])

  return { data, err }
}

export const useGetChapter = (doc_id, page_id) => {
  const [data, setData] = useState(null)
  const [err, setError] = useState(null)
  useEffect(() => {
    getChapter(doc_id, page_id)
      .then(({ data }) => {
        setData(data)
      })
      .catch((err) => {
        console.log(err)
        setError(err)
      })
  }, [doc_id, page_id])

  return { data, err }
}

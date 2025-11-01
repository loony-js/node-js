import { useEffect, useState } from "react"
import { getBlogNodes } from "./api"

export const useGetBlogNodes = (doc_id) => {
  const [data, setData] = useState(null)
  const [err, setError] = useState(null)
  useEffect(() => {
    getBlogNodes(doc_id)
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

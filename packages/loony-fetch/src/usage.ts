import { MiniAxios, CancelToken } from "./index"

const axios = new MiniAxios({
  headers: { "Content-Type": "application/json" },
  timeout: 5000,
})

const cancelToken = new CancelToken()

axios.useRequestInterceptor((config) => {
  console.log("Request:", config.url)
})

axios.useResponseInterceptor((response) => {
  console.log("Status:", response.status)
})

// Cancel after 1 second (demo)
setTimeout(() => {
  cancelToken.cancel("User canceled this request")
}, 1000)

axios
  .get<{ title: string }>("https://jsonplaceholder.typicode.com/posts/1", {
    cancelToken,
  })
  .then((res) => {
    console.log("Response Title:", res.data.title)
  })
  .catch((err) => {
    console.error("Error:", err.message)
  })

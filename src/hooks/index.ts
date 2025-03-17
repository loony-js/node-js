import { useEffect, useState } from "react"

export const useWebSocket = (): [
  WebSocket | undefined,
  () => Promise<void>,
  () => Promise<void>,
] => {
  const [socket, setSocket] = useState<undefined | WebSocket>()

  useEffect(() => {
    if (socket) {
      // Listen for messages
      socket.addEventListener("message", (event) => {
        console.log("Message from server:", event.data)
      })

      // Handle errors
      socket.addEventListener("error", (error) => {
        console.error("WebSocket error:", error)
      })

      // Handle connection close
      socket.addEventListener("close", () => {
        console.log("WebSocket connection closed")
      })
    }
  }, [socket])

  const connect = async () => {
    const ws = new WebSocket("ws://localhost:2000")

    ws.onopen = () => {
      setSocket(ws)
      console.log("WebSocket connected.")
    }

    ws.onclose = () => {
      setSocket(undefined)
      console.log("WebSocket closed.")
    }
  }
  const disConnect = async () => {
    if (socket) {
      socket.send("close")
      socket.close()
    }
  }

  return [socket, connect, disConnect]
}

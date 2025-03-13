import { useEffect, useState } from "react"

export const useWebSocket = (): [
  WebSocket | undefined,
  () => Promise<void>,
  () => Promise<void>,
] => {
  const [socket, setSocket] = useState<undefined | WebSocket>()

  useEffect(() => {
    if (socket) {
      // Connection opened
      socket.addEventListener("open", () => {
        console.log("Connected to WebSocket server")
        socket.send(JSON.stringify({ message: "Hello Server!" }))
      })

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
  }, [])

  const connect = async () => {
    setSocket(new WebSocket("ws://localhost:7000/ws"))
    console.log("WebSocket connected.")
  }
  const disConnect = async () => {
    if (socket) {
      socket.send("close")
      socket.close()
      setSocket(undefined)
      console.log("WebSocket dis_connected.")
    }
  }

  return [socket, connect, disConnect]
}

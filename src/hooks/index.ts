import { useCallback, useEffect, useState } from "react"

export const useWebSocket = (): [
  WebSocket | undefined,
  () => void,
  () => void,
] => {
  const [socket, setSocket] = useState<undefined | WebSocket>()

  useEffect(() => {
    if (socket) {
      function handleMessage(event: MessageEvent<unknown>) {
        console.log("Message from server:", event.data)
      }
      function handleError(event: Event) {
        console.error("WebSocket error:", event)
      }
      function handleClose(event: Event) {
        setSocket(undefined)
        console.log(socket, "socket")
        console.log("Closed", event)
      }
      socket.addEventListener("message", handleMessage)
      socket.addEventListener("error", handleError)
      socket.addEventListener("close", handleClose)
      return () => {
        socket?.removeEventListener("message", handleMessage)
        socket?.removeEventListener("error", handleError)
        socket?.removeEventListener("close", handleClose)
      }
    }
  }, [socket])

  const connect = useCallback(() => {
    const ws = new WebSocket("ws://localhost:2000")
    function handleOpen(event: Event) {
      console.log(event, "Websocket connected.")
      setSocket(ws)
    }
    ws.addEventListener("open", handleOpen)
    return () => {
      ws.removeEventListener("open", handleOpen)
    }
  }, [])

  const disConnect = useCallback(() => {
    if (socket) {
      socket.send("close")
      setTimeout(() => {
        socket.close()
      }, 1000)
    }
  }, [socket])

  return [socket, connect, disConnect]
}

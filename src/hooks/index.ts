import { useCallback, useEffect, useState, useRef } from "react"
import { ImplsAudioContext } from "loony-web-audio"

export const useWebSocket = (): [
  WebSocket | undefined,
  () => void,
  () => void,
] => {
  const [socket, setSocket] = useState<undefined | WebSocket>()

  useEffect(() => {
    if (socket) {
      function handleMessage(event: MessageEvent<unknown>) {
        console.log("Message:", event.data)
      }
      function handleError(event: Event) {
        console.error("WebSocket error:", event)
      }
      function handleClose() {
        console.log("WebSocket closed.")
        setSocket(undefined)
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
    function handleOpen() {
      console.log("Websocket connected.")
      setSocket(ws)
    }
    ws.addEventListener("open", handleOpen)
    return () => {
      ws.removeEventListener("open", handleOpen)
    }
  }, [])

  const disConnect = useCallback(() => {
    if (socket) {
      console.log("Close Web Socket")
      socket.close(1000)
    }
  }, [socket])

  return [socket, connect, disConnect]
}

export const useMicrophone = (): [
  boolean,
  (socket: WebSocket) => void,
  (socket: WebSocket) => void,
  () => string | undefined,
] => {
  const [isRecording, setRecording] = useState(false)
  const recorder = useRef<ImplsAudioContext | null>(null)

  const startRecording = (socket: WebSocket) => {
    if (!recorder.current && socket) {
      ImplsAudioContext.create().then((res) => {
        recorder.current = res
        recorder.current?.startRecording(socket as WebSocket)
        setRecording(true)
      })
    }
  }
  const stopRecording = (socket: WebSocket) => {
    if (socket) {
      recorder.current?.stopRecording()
      recorder.current = null
      setRecording(false)
    }
  }

  const getAudioUrl = () => {
    return recorder.current?.getAudioUrl()
  }

  return [isRecording, startRecording, stopRecording, getAudioUrl]
}

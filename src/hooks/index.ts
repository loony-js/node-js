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

export const useMicrophone = (): [
  boolean,
  () => void,
  (socket: WebSocket) => void,
  (socket: WebSocket) => void,
  () => string | undefined,
] => {
  const [isRecording, setRecording] = useState(false)
  const recorder = useRef<ImplsAudioContext | null>(null)

  const create = () => {
    ImplsAudioContext.create().then((res) => {
      recorder.current = res
    })
  }

  const startRecording = (socket: WebSocket) => {
    if (recorder && socket) {
      socket.send("START_VOICE_RECORDING")

      setTimeout(() => {
        recorder.current?.startRecording(socket as WebSocket)
        setRecording(true)
      }, 500)
    }
  }
  const stopRecording = (socket: WebSocket) => {
    if (socket) {
      socket.send("STOP_VOICE_RECORDING")
      recorder.current?.stopRecording()
      setRecording(false)
    }
  }

  const getAudioUrl = () => {
    return recorder.current?.getAudioUrl()
  }

  return [isRecording, create, startRecording, stopRecording, getAudioUrl]
}

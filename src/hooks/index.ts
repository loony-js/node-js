import { useCallback, useEffect, useState, useRef } from "react"
import { getVoiceRecorder, VoiceRecorder } from "loony-web-audio"

export const useWebSocket = (
  url: string,
): [WebSocket | undefined, () => void, () => void] => {
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
    const ws = new WebSocket(url)
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

export const useMicrophone = (): {
  isRecording: boolean
  startRecordingWithSocket: (socket: WebSocket) => void
  startRecording: () => void
  stopRecording: () => void
  getAudioUrl: () => string | undefined
} => {
  const [isRecording, setRecording] = useState(false)
  const recorder = useRef<VoiceRecorder | null>(null)

  const startRecordingWithSocket = (socket: WebSocket) => {
    if (!recorder.current && socket) {
      getVoiceRecorder(undefined).then((res) => {
        recorder.current = res
        recorder.current?.startRecordingWithSocket(socket as WebSocket)
        setRecording(true)
      })
    }
  }

  const startRecording = () => {
    recorder.current = null
    if (!recorder.current) {
      getVoiceRecorder(undefined).then((res) => {
        recorder.current = res
        recorder.current?.startRecording()
        setRecording(true)
      })
    }
  }

  const stopRecording = () => {
    recorder.current?.stopRecording()
    setRecording(false)
  }

  const getAudioUrl = () => {
    const url = recorder.current?.getAudioUrl()
    recorder.current = null
    return url
  }

  return {
    isRecording,
    startRecordingWithSocket,
    startRecording,
    stopRecording,
    getAudioUrl,
  }
}

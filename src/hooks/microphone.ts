import { getVoiceRecorder, VoiceRecorder } from "loony-web-audio"
import { useRef, useState } from "react"

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

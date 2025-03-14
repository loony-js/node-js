import { useWebSocket } from "hooks"
import { ImplsAudioContext } from "loony-web-audio"
import { useEffect, useState, useRef } from "react"

export default function VoiceStreaming() {
  const [isRecording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined)
  const mediaRecorderRef = useRef<ImplsAudioContext | null>(null)
  const [socket, connect, disconnect]: [
    WebSocket | undefined,
    () => Promise<void>,
    () => Promise<void>,
  ] = useWebSocket()

  useEffect(() => {
    ImplsAudioContext.create().then((res) => {
      mediaRecorderRef.current = res
    })
  }, [])

  const startRecording = () => {
    if (mediaRecorderRef && socket) {
      socket.send("start")
      // mediaRecorderRef.current?.socketConnect(socket as WebSocket)
      // setRecording(true)
    }
  }
  const stopRecording = () => {
    if (socket) {
      socket.send("end")
      mediaRecorderRef.current?.disconnect()
      setRecording(false)
      const url = mediaRecorderRef.current?.getAudioUrl()
      setAudioUrl(url)
      disconnect()
    }
  }
  console.log(socket?.OPEN)
  return (
    <div className="centered-con">
      <div className="">
        <h2 className="">Voice Recorder</h2>
        <hr />
        <div className="">
          <div className="pad-ver-5">
            {socket?.OPEN ? (
              <span className="green-txt">Socket Connected</span>
            ) : (
              <span className="red-txt">Socket Disconnected</span>
            )}
          </div>
          <div className="pad-ver-5">
            <button
              className="btn-sm"
              onClick={socket?.OPEN ? disconnect : connect}
            >
              🎙️ {socket?.OPEN ? "DisConnect" : "Connect"}
            </button>
          </div>
        </div>
        <hr />
        <div>
          <div className="pad-ver-5">
            {isRecording ? (
              <span className="green-txt">Recording</span>
            ) : (
              <span className="red-txt">Not Recording</span>
            )}
          </div>
          <div className="pad-ver-5">
            <button
              className="btn-sm"
              onClick={startRecording}
              disabled={isRecording}
            >
              🎙️ Start Recording
            </button>
            <button
              className="btn-sm"
              onClick={stopRecording}
              disabled={!isRecording}
            >
              ⏹️ Stop Recording
            </button>
          </div>
        </div>
        {audioUrl && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Playback:</h3>
            <audio controls src={audioUrl} className="mt-2"></audio>
          </div>
        )}
      </div>
    </div>
  )
}

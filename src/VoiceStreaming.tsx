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
      socket.send("START_VOICE_RECORDING")

      setTimeout(() => {
        mediaRecorderRef.current?.startRecording(socket as WebSocket)
        setRecording(true)
      }, 500)
    }
  }
  const stopRecording = () => {
    if (socket) {
      socket.send("STOP_VOICE_RECORDING")
      mediaRecorderRef.current?.stopRecording()
      setRecording(false)
      const url = mediaRecorderRef.current?.getAudioUrl()
      setAudioUrl(url)
    }
  }

  const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files
    if (!file || !socket) return
    socket.send("START_VOICE_RECORDING")

    // Read file as ArrayBuffer
    const reader = new FileReader()
    reader.readAsArrayBuffer(file[0])

    reader.onload = () => {
      const audioBuffer = reader.result
      socket.send(audioBuffer as ArrayBuffer)
      socket.send("STOP_VOICE_RECORDING")
    }

    reader.onerror = (error) => console.error("Error reading file:", error)
  }

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
        <div>
          <div className="pad-ver-5">
            {isRecording ? (
              <span className="green-txt">Recording</span>
            ) : (
              <span className="red-txt">Not Recording</span>
            )}
          </div>
          <div className="pad-ver-5">
            <input type="file" onChange={onChangeFile} />
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

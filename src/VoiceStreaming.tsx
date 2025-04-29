import { useWebSocket, useMicrophone } from "hooks"
import "./assets/css/desktop.css"
import { useState } from "react"

const withSocket = true
const defaultSocketUrl = `ws://localhost:2000/ws`

export default function VoiceStreaming() {
  const [url, setUrl] = useState(defaultSocketUrl)
  const [socket, connect, disconnect]: [
    WebSocket | undefined,
    () => void,
    () => void,
  ] = useWebSocket(url)

  const [audioUrl, setAudioUrl] = useState<string | undefined>()

  const {
    isRecording,
    startRecordingWithSocket,
    startRecording,
    stopRecording,
    getAudioUrl,
  } = useMicrophone()

  const onClickStartRecording = () => {
    if (withSocket && socket) {
      socket.send("START_VOICE_RECORDING")

      // We need this timeout to give time to initialize the Speechmatics web socket.
      setTimeout(() => {
        startRecordingWithSocket(socket)
      }, 1000)
    } else {
      startRecording()
    }
  }

  const onClickStopRecording = () => {
    if (withSocket && socket) {
      socket.send("STOP_VOICE_RECORDING")
      stopRecording()
      setAudioUrl(getAudioUrl())
    } else {
      stopRecording()
      const audiourl = getAudioUrl()
      setAudioUrl(audiourl)
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
    <div className="con-sm-12 con-xxl-5 mar-hor-1 mar-top-1">
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
            <div>
              Port:{" "}
              <input
                onChange={(e) => {
                  setUrl(e.target.value)
                }}
                value={defaultSocketUrl}
              />
            </div>
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
              onClick={
                isRecording ? onClickStopRecording : onClickStartRecording
              }
            >
              🎙️ {isRecording ? "Stop" : "Start"}
            </button>
          </div>
        </div>
        <hr />
        <div>
          <div className="pad-ver-5">
            <input type="file" onChange={onChangeFile} />
          </div>
        </div>

        {audioUrl && (
          <div>
            <audio src={audioUrl} controls>
              {/* <source src={audioUrl} type="audio/wav"></source> */}
            </audio>
          </div>
        )}
      </div>

      <div style={{ marginTop: 25 }}>
        <ul>
          {texts.map((t, index) => {
            return <li key={index}>{t}</li>
          })}
        </ul>
      </div>
    </div>
  )
}

const texts = [
  "that will cost nine hundred dollars.",
  "my phone number is one eight hundred, four five six, eight nine ten.",
  "the time is six forty five p m.",
  "I live on thirty five lexington avenue",
  "the answer is six point five.",
  "send it to support at help dot com",
  "the options are apple forward slash banana forward slash orange period",
]

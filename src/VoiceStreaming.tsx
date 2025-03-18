import { useWebSocket, useMicrophone } from "hooks"
import "./assets/css/desktop.css"

export default function VoiceStreaming() {
  const [socket, connect, disconnect]: [
    WebSocket | undefined,
    () => void,
    () => void,
  ] = useWebSocket()
  const [isRecording, startRecording, stopRecording] = useMicrophone()

  const onClickStartRecording = () => {
    if (socket) {
      socket.send("START_VOICE_RECORDING")

      // We need this timeout to give time to initialize the Speechmatics web socket.
      setTimeout(() => {
        startRecording(socket)
      }, 1000)
    }
  }

  const onClickStopRecording = () => {
    if (socket) {
      socket.send("STOP_VOICE_RECORDING")
      stopRecording(socket)
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
      </div>

      <div>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industrys standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book.
      </div>
    </div>
  )
}

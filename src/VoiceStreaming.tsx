import { useWebSocket, useMicrophone } from "hooks"
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
    <div className="w-[60%] mx-auto p-4 space-y-6">
      <div className="space-y-4 bg-white border rounded-lg shadow p-6">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800">Voice Recorder</h2>
        <hr className="border-gray-300" />

        {/* Socket Status */}
        <div className="space-y-4">
          <div>
            {socket?.OPEN ? (
              <span className="text-green-600 font-medium">
                Socket Connected
              </span>
            ) : (
              <span className="text-red-600 font-medium">
                Socket Disconnected
              </span>
            )}
          </div>

          {/* Port Input */}
          <div className="flex items-center gap-2">
            <label className="text-gray-700 font-medium">Port:</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Connect/Disconnect Button */}
          <div>
            <button
              onClick={socket?.OPEN ? disconnect : connect}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
            >
              🎙️ {socket?.OPEN ? "Disconnect" : "Connect"}
            </button>
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* Recording Status */}
        <div className="space-y-4">
          <div>
            {isRecording ? (
              <span className="text-green-600 font-medium">Recording</span>
            ) : (
              <span className="text-red-600 font-medium">Not Recording</span>
            )}
          </div>

          {/* Start/Stop Button */}
          <div>
            <button
              onClick={
                isRecording ? onClickStopRecording : onClickStartRecording
              }
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              🎙️ {isRecording ? "Stop" : "Start"}
            </button>
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* Upload File */}
        <div>
          <input
            type="file"
            onChange={onChangeFile}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Audio Playback */}
        {audioUrl && (
          <div>
            <audio src={audioUrl} controls className="w-full mt-2" />
          </div>
        )}
      </div>

      {/* Transcription List */}
      <div className="mt-6 bg-gray-50 border rounded-lg p-4">
        <ul className="list-disc list-inside space-y-1 text-gray-800">
          {texts.map((t, index) => (
            <li key={index}>{t}</li>
          ))}
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
  "i got an x l t shirt",
  "my name is jennifer smith",
  "i want to visit new york city.",
  "i uh said that we can go to the uhmm movies.",
  "its its not that big of uhm a deal",
  "umm i think tomorrow should work",
  "how are you",
  "we can go to the mall park or beach",
  "they entered the room dot dot dot",
  "i heart emoji you period",
  "the options are apple forward slash banana forward slash orange period",
  "are you sure question mark",
]

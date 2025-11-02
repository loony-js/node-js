import { useWebSocket } from "hooks/socket"
import { useMicrophone } from "hooks/microphone"
import { useState } from "react"
import { Button, Input } from "loony-ui"

const withSocket = true
const defaultSocketUrl = `ws://localhost:2011/ws`

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
    <main className="flex-1 min-h-screen ml-64 bg-stone-50 dark:bg-[#212121] text-white pt-16">
      <div className="w-[60%] mx-auto p-4 space-y-6">
        <div className="space-y-4 border rounded-lg shadow p-6">
          {/* Title */}
          <h2 className="text-2xl font-semibold">Voice Recorder</h2>
          <hr className="border-gray-300" />

          {/* Socket Status */}
          <div className="space-y-4">
            <div>
              {socket?.OPEN ? (
                <span className="font-medium">Socket Connected</span>
              ) : (
                <span className="text-red-600 font-medium">
                  Socket Disconnected
                </span>
              )}
            </div>

            {/* Port Input */}
            <div className="flex items-center gap-2">
              <label className="font-medium">Port:</label>
              <Input
                name="Port"
                type="text"
                value={url}
                placeholder="Enter port"
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            {/* Connect/Disconnect Button */}
            <div>
              <Button
                variant="border"
                onClick={socket?.OPEN ? disconnect : connect}
              >
                {socket?.OPEN ? "Disconnect" : "Connect"}
              </Button>
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
              <Button
                variant="submit"
                onClick={
                  isRecording ? onClickStopRecording : onClickStartRecording
                }
              >
                {isRecording ? "Stop" : "Start"}
              </Button>
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* Upload File */}
          <div>
            <input
              type="file"
              onChange={onChangeFile}
              className="block w-full text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
        <div className="mt-6 border rounded-lg p-4">
          <ul className="list-disc list-inside space-y-1">
            {texts.map((t, index) => (
              <li key={index}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
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

### ImplsAudioContext

```js
import { ImplsAudioContext } from "loony-web-audio"
import { useEffect, useState, useRef } from "react"

function App() {
  const [isRecording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = (useState < string) | (undefined > undefined)
  const mediaRecorderRef = (useRef < ImplsAudioContext) | (null > null)

  useEffect(() => {
    ImplsAudioContext.create().then((res) => {
      mediaRecorderRef.current = res
    })
  }, [])

  const startRecording = () => {
    if (mediaRecorderRef) {
      mediaRecorderRef.current?.connect()
      setRecording(true)
    }
  }
  const stopRecording = () => {
    if (mediaRecorderRef) {
      mediaRecorderRef.current?.disconnect()
      setRecording(false)
      const url = mediaRecorderRef.current?.getAudioUrl()
      setAudioUrl(url)
    }
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-bold mb-4">Voice Recorder</h2>
      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400"
          onClick={startRecording}
          disabled={isRecording}
        >
          🎙️ Start Recording
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-400"
          onClick={stopRecording}
          disabled={!isRecording}
        >
          ⏹️ Stop Recording
        </button>
      </div>

      {audioUrl && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Playback:</h3>
          <audio controls src={audioUrl} className="mt-2"></audio>
        </div>
      )}
    </div>
  )
}

export default App
```

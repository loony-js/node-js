import { useNavigate } from "react-router"

export default function Home() {
  const navigate = useNavigate()
  return (
    <div>
      <div>Home</div>
      <div
        onClick={() => {
          navigate("/crypto")
        }}
      >
        crypto
      </div>
      <div
        onClick={() => {
          navigate("/voiceStreaming")
        }}
      >
        Voice Streaming
      </div>
    </div>
  )
}

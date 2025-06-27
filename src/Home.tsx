import { useNavigate } from "react-router"

export default function Home() {
  const navigate = useNavigate()
  return (
    <div className="w-[60%] mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => {
            navigate("/crypto")
          }}
          className="bg-white shadow rounded-md p-4 transition-shadow duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
        >
          <h2 className="text-lg font-semibold">Aegis</h2>
          <p className="text-gray-600">
            Never forget your username and password. We store them securely.
          </p>
        </div>
        <div
          onClick={() => {
            navigate("/voiceStreaming")
          }}
          className="bg-white shadow rounded-md p-4 transition-shadow duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
        >
          <h2 className="text-lg font-semibold">Voice Streaming</h2>
          <p className="text-gray-600">Stream audio data.</p>
        </div>
      </div>
    </div>
  )
}

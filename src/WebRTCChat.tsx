import React, { useRef, useState, useEffect } from "react"

const SIGNALING_SERVER = "wss://your-signaling-server" // Replace this with your server URL
const STUN_SERVER = { urls: "stun:stun.l.google.com:19302" }

export default function WebRTCChat() {
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const [ws, setWs] = useState(null)
  const [pc, setPc] = useState<RTCPeerConnection | null>(null)
  const [dataChannel, setDataChannel] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")

  useEffect(() => {
    const socket = new WebSocket(SIGNALING_SERVER)
    socket.onmessage = async (msg) => {
      const data = JSON.parse(msg.data)
      if (!pc) return

      if (data.type === "offer") {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        socket.send(JSON.stringify({ type: "answer", sdp: answer }))
      } else if (data.type === "answer") {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
      } else if (data.type === "candidate" && data.candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate))
      }
    }
    setWs(socket)
  }, [])

  async function createPeerConnection(isInitiator = false) {
    const connection = new RTCPeerConnection({ iceServers: [STUN_SERVER] })
    setPc(connection)

    // Local media
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })
    localVideoRef.current.srcObject = stream
    stream.getTracks().forEach((track) => connection.addTrack(track, stream))

    // Remote media
    connection.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0]
    }

    // ICE handling
    connection.onicecandidate = (event) => {
      if (event.candidate) {
        ws.send(
          JSON.stringify({ type: "candidate", candidate: event.candidate }),
        )
      }
    }

    // Data channel setup
    if (isInitiator) {
      const dc = connection.createDataChannel("chat")
      setupDataChannel(dc)
      const offer = await connection.createOffer()
      await connection.setLocalDescription(offer)
      ws.send(JSON.stringify({ type: "offer", sdp: offer }))
    } else {
      connection.ondatachannel = (event) => setupDataChannel(event.channel)
    }
  }

  function setupDataChannel(channel) {
    channel.onopen = () => console.log("✅ Data channel open")
    channel.onmessage = (e) => {
      setMessages((prev) => [...prev, { sender: "peer", text: e.data }])
    }
    setDataChannel(channel)
  }

  function sendMessage() {
    if (dataChannel?.readyState === "open") {
      dataChannel.send(input)
      setMessages((prev) => [...prev, { sender: "me", text: input }])
      setInput("")
    }
  }

  return (
    <main className="flex-1 min-h-screen ml-64 bg-stone-50 dark:bg-[#212121] text-white pt-16">
      <div className="flex flex-col items-center gap-4 p-6">
        <h2 className="text-2xl font-semibold mb-2">🎥 WebRTC Chat</h2>

        <div className="flex gap-4">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-64 h-48 bg-black rounded-xl"
          />
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-64 h-48 bg-black rounded-xl"
          />
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={() => createPeerConnection(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Start Call
          </button>
          <button
            onClick={() => createPeerConnection(false)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Join Call
          </button>
        </div>

        <div className="w-80 mt-4">
          <div className="border rounded-lg p-2 h-48 overflow-y-auto bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.sender === "me" ? "text-right" : "text-left"}
              >
                <span
                  className={`inline-block px-2 py-1 rounded-lg ${m.sender === "me" ? "bg-blue-200" : "bg-gray-200"}`}
                >
                  {m.text}
                </span>
              </div>
            ))}
          </div>
          <div className="flex mt-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded-l-lg px-2 py-1 outline-none"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="px-4 py-1 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

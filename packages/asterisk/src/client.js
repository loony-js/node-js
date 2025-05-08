import {
  createBridge,
  answerCall,
  createExternalMediaChannel,
  addChannelToBridge,
  playAudio,
} from "./utils"

const username = "loony"
const password = "password"
const appName = "loony"

async function main() {
  const ws = new WebSocket(
    `ws://localhost:8088/ari/events?api_key=${username}:${password}&app=${appName}`,
  )
  ws.onopen = async () => {
    console.log("WebSocket connected to Asterisk ARI")
  }
  ws.onmessage = async (event) => {
    const data = JSON.parse(event.data)
    switch (data.type) {
      case "StasisStart": {
        const { id, name } = data.channel
        if (name.startsWith("PJSIP")) {
          console.log("StasisStart", "PJSIP")
          await answerCall(id)
          await playAudio(id, "hello-world")
          const bridge = await createBridge()
          const e_channel = await createExternalMediaChannel()
          await addChannelToBridge(bridge.id, id)
          await addChannelToBridge(bridge.id, e_channel.id)
        }
        break
      }
      case "StasisEnd": {
        console.log("StasisEnd")
        console.log("\n\n")
        break
      }
      case "ChannelHangupRequest": {
        console.log("ChannelHangupRequest")
        break
      }
      case "ChannelDtmfReceived": {
        console.log("ChannelDtmfReceived")
        break
      }
      case "PlaybackStarted": {
        console.log("PlaybackStarted")
        break
      }
      case "PlaybackFinished": {
        console.log("PlaybackFinished")
        break
      }
      default:
        break
    }
  }
  ws.onerror = (err) => {
    console.error("WebSocket error:", err)
  }
  ws.onclose = () => {
    console.log("WebSocket closed")
  }
}

main()

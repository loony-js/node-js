import internal from "stream"
import WebSocket from "ws"
import crypto from "crypto"

const createConnection = (): Promise<WebSocket> => {
  return new Promise((resolve, reject) => {
    console.log("Init Speechmatics Web Socket Connection..")
    const apiKey = "evK20Lpk7TTRtpNAv0Cbh4pCBzvr32Y6"
    if (!apiKey) {
      throw new Error("Please set the API_KEY environment variable")
    }

    const url =
      "wss://eu2.rt.speechmatics.com/v2?jwt=evK20Lpk7TTRtpNAv0Cbh4pCBzvr32Y6"

    // Generate a random 16-character string
    const secKey = crypto.randomBytes(16).toString("base64")

    const ws = new WebSocket(url, {
      headers: {
        Host: "eu2.rt.speechmatics.com",
        Authorization: "Bearer evK20Lpk7TTRtpNAv0Cbh4pCBzvr32Y6",
        "Sec-WebSocket-Key": secKey,
        Connection: "keep-alive, Upgrade",
        Upgrade: "websocket",
        "Sec-WebSocket-Version": "13",
      },
    })

    ws.on("open", () => {
      console.log("Connected to Speechmatics Websocket")
      resolve(ws)
    })

    ws.on("message", (message) => {
      console.log("Received:", message.toString())
    })

    ws.on("error", (error) => {
      console.error("Speechmatics WebSocket error:", error)
      reject(error)
    })

    ws.on("close", (code, reason) => {
      console.log(`Speechmatics WebSocket closed: ${code} - ${reason}`)
    })
  })
}

let speechmatics: WebSocket | null = null

export function connection(socket: internal.Duplex) {
  let last_seq_no = 0

  socket.on("data", async (data) => {
    if (data.length < 2) return // Ignore invalid frames

    const opcode = data[0] & 0x0f // Extract opcode
    const isMasked = (data[1] & 0x80) !== 0 // Check if masked (client messages must be masked)
    let payloadLength = data[1] & 0x7f // Extract payload length

    let offset = 2 // Start of payload or mask key
    if (payloadLength === 126) {
      payloadLength = data.readUInt16BE(2)
      offset = 4
    } else if (payloadLength === 127) {
      payloadLength = data.readBigUInt64BE(2)
      offset = 10
    }

    let payload = Buffer.alloc(0)
    if (isMasked) {
      const maskKey = data.slice(offset, offset + 4)
      offset += 4

      payload = data.slice(offset, offset + payloadLength)
      for (let i = 0; i < payload.length; i++) {
        payload[i] ^= maskKey[i % 4] // Unmasking process
      }
    } else {
      payload = data.slice(offset, offset + payloadLength)
    }
    switch (opcode) {
      case 0x1: // Text Frame
        if (payload.toString() === "START_VOICE_RECORDING") {
          createConnection().then((s) => {
            speechmatics = s
            speechmatics.send(
              JSON.stringify({
                message: "StartRecognition",
                audio_format: {
                  type: "raw",
                  encoding: "pcm_s16le", // ["pcm_f32le", "pcm_s16le"]
                  sample_rate: 16000,
                },
                transcription_config: {
                  language: "en",
                  operating_point: "enhanced",
                  output_locale: "en-US",
                  additional_vocab: ["gnocchi", "bucatini", "bigoli"],
                  diarization: "speaker",
                  enable_partials: false,
                },
                translation_config: {
                  target_languages: [],
                  enable_partials: false,
                },
                audio_events_config: {
                  types: ["applause", "music"],
                },
              }),
            )
          })
        }
        if (payload.toString() === "STOP_VOICE_RECORDING") {
          speechmatics?.send(
            JSON.stringify({
              message: "EndOfStream",
              last_seq_no: last_seq_no,
            }),
          )
          speechmatics = null
        }
        break

      case 0x2: // Binary Frame
        speechmatics?.send(payload)
        last_seq_no += 1
        break

      case 0x8: // Close Frame
        socket.destroy()
        break

      case 0x9: // Ping Frame
        console.log("Received Ping, sending Pong")
        break

      case 0xa: // Pong Frame
        console.log("Received Pong")
        break

      default:
        console.log("Unknown Opcode:", opcode)
    }
  })
}

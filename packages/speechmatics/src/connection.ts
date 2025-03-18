import internal from "stream"
import WebSocket from "ws"
import crypto from "crypto"

export async function connection(socket: internal.Duplex) {
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
  })

  ws.on("message", (message) => {
    console.log("Received:", message.toString())
  })

  ws.on("error", (error) => {
    console.error("Speechmatics WebSocket error:", error)
  })

  ws.on("close", (code, reason) => {
    console.log(`Speechmatics WebSocket closed: ${code} - ${reason}`)
  })

  let last_seq_no = 0
  // // Handling WebSocket communication

  socket.on("data", async (data) => {
    if (data.length > 50) {
      ws.send(data)
      last_seq_no += 1
    } else {
      const msg = decodeWebSocketMessage(data)
      if (msg === "START_VOICE_RECORDING") {
        console.log(data.length, data)
        console.log("START_VOICE_RECORDING")
        ws.send(
          JSON.stringify({
            message: "StartRecognition",
            audio_format: {
              type: "raw",
              // encoding: "pcm_f32le",
              encoding: "pcm_s16le",
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
      } else if (msg === "STOP_VOICE_RECORDING") {
        console.log("STOP_VOICE_RECORDING")
        ws.send(
          JSON.stringify({
            message: "EndOfStream",
            last_seq_no: last_seq_no,
          }),
        )
      }
    }
  })
}

// Decode WebSocket frame
function decodeWebSocketMessage(buffer: Buffer) {
  const secondByte = buffer[1]
  const length = secondByte & 127
  const maskStart = 2
  const dataStart = maskStart + 4
  const mask = buffer.slice(maskStart, maskStart + 4)
  const data = buffer.slice(dataStart, dataStart + length)
  let result = ""

  for (let i = 0; i < length; i++) {
    result += String.fromCharCode(data[i] ^ mask[i % 4]) // Apply unmasking
  }
  return result
}

// Encode WebSocket frame
// function encodeWebSocketMessage(message: string) {
//   const messageBuffer = Buffer.from(message)
//   const length = messageBuffer.length
//   const frame = [0x81] // FIN + Text Frame (Opcode 0x1)

//   if (length < 126) {
//     frame.push(length)
//   } else if (length < 65536) {
//     frame.push(126, length >> 8, length & 255)
//   } else {
//     frame.push(
//       127,
//       0,
//       0,
//       0,
//       0,
//       (length >> 24) & 255,
//       (length >> 16) & 255,
//       (length >> 8) & 255,
//       length & 255,
//     )
//   }

//   return Buffer.concat([Buffer.from(frame), messageBuffer])
// }

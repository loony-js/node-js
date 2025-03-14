/**
 * This file showcases the real-time-client package being used in NodeJS.
 *
 * It will connect to the real-time API and transcribe a file in real-time.
 * To run this example, you will need to have a Speechmatics API key,
 * which can be generated from the Speechmatics Portal: https://portal.speechmatics.com/api-keys
 *
 * NOTE: This script is run as an ES Module via tsx, letting us use top-level await.
 * The library also works with CommonJS, but the code would need to be wrapped in an async function.
 */
import {
  RealtimeClient,
  RealtimeServerMessage,
  RecognitionResult,
} from "@speechmatics/real-time-client"
import dotenv from "dotenv"
import { createSpeechmaticsJWT } from "@speechmatics/auth"
import internal from "stream"

export async function connection(socket: internal.Duplex) {
  dotenv.config()

  const apiKey = "ieDYfZVXcfmLpVKzLVQ64C9BbdJznb6O"
  if (!apiKey) {
    throw new Error("Please set the API_KEY environment variable")
  }

  const client = new RealtimeClient()

  client.addEventListener(
    "receiveMessage",
    ({ data }: { data: RealtimeServerMessage }) => {
      if (data.message === "AddPartialTranscript") {
        const partialText = data.results
          .map((r) => r.alternatives?.[0].content)
          .join(" ")
        console.log(partialText)
      } else if (data.message === "AddTranscript") {
        const finalText = data.results
          .map((r: RecognitionResult) => r.alternatives?.[0].content)
          .join(" ")
        console.log(finalText)
      } else if (data.message === "EndOfTranscript") {
        process.stdout.write("\n")
      } else if (data.message === "Error") {
        console.log(data.reason)
      }
    },
  )

  const jwt = await createSpeechmaticsJWT({
    type: "rt",
    apiKey,
    ttl: 60, // 1 minute
  })

  // Handling WebSocket communication
  socket.on("data", async (data) => {
    const msg = decodeWebSocketMessage(data)
    if (msg === "START_VOICE_RECORDING") {
      console.log("START_VOICE_RECORDING")
      await client.start(jwt, {
        transcription_config: {
          language: "en",
          enable_partials: true,
        },
        audio_format: {
          type: "raw",
          encoding: "pcm_s16le",
          sample_rate: 16000,
        },
      })
    } else if (msg === "STOP_VOICE_RECORDING") {
      console.log("STOP_VOICE_RECORDING")
      client.stopRecognition({ noTimeout: true })
    } else {
      client.sendAudio(data as unknown as ArrayBufferLike)
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

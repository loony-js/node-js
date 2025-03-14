import express from "express"
import http from "http"
import crypto from "crypto"

const PORT = process.env.PORT || 1234
const app = express()
const server = http.createServer(app)

// Handling WebSocket connections
server.on("upgrade", (request, socket) => {
  console.log("Upgrade", request.headers["upgrade"])
  // WebSocket handshake
  if (request.headers["upgrade"] !== "websocket") {
    socket.destroy()
    return
  }

  const key = request.headers["sec-websocket-key"]
  if (!key) {
    socket.write("HTTP/1.1 400 Bad Request\r\n\r\n")
    socket.destroy()
    return
  }

  const acceptKey = generateWebSocketAcceptKey(key)
  socket.write(
    "HTTP/1.1 101 Switching Protocols\r\n" +
      "Upgrade: websocket\r\n" +
      "Connection: Upgrade\r\n" +
      `Sec-WebSocket-Accept: ${acceptKey}\r\n\r\n`,
  )

  // Handling WebSocket communication
  socket.on("data", (data) => {
    const res = decodeWebSocketMessage(data)
    const res1 = encodeWebSocketMessage(res)
    console.log("Received from client:", res)
    socket.write(res1)
  })

  socket.on("end", () => {
    console.log("Client disconnected")
  })

  socket.on("error", (err) => {
    console.error("Socket error:", err)
  })
})

// Middleware
app.use(express.json())

// Simple Route
app.get("/", (req, res) => {
  res.send("Hello, Express!")
})

// Start Server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

function generateWebSocketAcceptKey(key: string) {
  return crypto
    .createHash("sha1")
    .update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11")
    .digest("base64")
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
function encodeWebSocketMessage(message: string) {
  const messageBuffer = Buffer.from(message)
  const length = messageBuffer.length
  const frame = [0x81] // FIN + Text Frame (Opcode 0x1)

  if (length < 126) {
    frame.push(length)
  } else if (length < 65536) {
    frame.push(126, length >> 8, length & 255)
  } else {
    frame.push(
      127,
      0,
      0,
      0,
      0,
      (length >> 24) & 255,
      (length >> 16) & 255,
      (length >> 8) & 255,
      length & 255,
    )
  }

  return Buffer.concat([Buffer.from(frame), messageBuffer])
}

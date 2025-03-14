import express from "express"
import http from "http"
import crypto from "crypto"
import { connection } from "./connection"

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

  connection(socket)

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

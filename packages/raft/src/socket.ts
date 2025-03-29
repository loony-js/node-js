import crypto from "crypto"
import http from "http"
import internal from "stream"

export const handleWebSocket = (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>,
  clients: Set<internal.Duplex>,
) => {
  // Handling WebSocket connections
  server.on("upgrade", (request, socket) => {
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

    socket.on("close", () => {
      socket.destroy()
      clients.delete(socket)
      console.log(clients.size)
    })
    socket.on("end", () => {
      socket.write(
        "HTTP/1.1 200 Success\r\n" +
          "Connection: close\r\n" +
          "Content-Length: 0\r\n" +
          "\r\n",
      )
      socket.destroy()
    })

    socket.on("error", (err) => {
      console.error("Socket error:", err)
    })

    handleMessage(socket)

    clients.add(socket)
  })
}

export function handleMessage(socket: internal.Duplex) {
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
        console.log(payload.toString())
        break

      case 0x2: // Binary Frame
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

function generateWebSocketAcceptKey(key: string) {
  return crypto
    .createHash("sha1")
    .update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11")
    .digest("base64")
}

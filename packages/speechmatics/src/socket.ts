import crypto from "crypto"
import http from "http"
import internal from "stream"
import { connection, createConnection } from "./connection"

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
    const speechmaticsWS = createConnection()
    connection(socket, speechmaticsWS)

    socket.on("close", () => {
      console.log("on.close")
      speechmaticsWS.close()
      socket.destroy()
      clients.delete(socket)
      console.log(clients.size)
    })
    socket.on("end", () => {
      console.log("on.end")
      speechmaticsWS.close()
      socket.write(
        "HTTP/1.1 200 Success\r\n" +
          "Connection: close\r\n" +
          "Content-Length: 0\r\n" +
          "\r\n",
      )
      socket.destroy()
    })

    socket.on("error", (err) => {
      console.log("on.error")
      console.error("Socket error:", err)
    })

    clients.add(socket)
  })
}

function generateWebSocketAcceptKey(key: string) {
  return crypto
    .createHash("sha1")
    .update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11")
    .digest("base64")
}

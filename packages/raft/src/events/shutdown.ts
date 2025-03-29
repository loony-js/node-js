import internal from "stream"
import http from "http"

export default function (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>,
  clients: Set<internal.Duplex>,
) {
  // Gracefully close WebSocket connections on process termination
  const gracefulShutdown = () => {
    console.log("Shutting down server.")

    // Notify clients about server shutdown
    clients.forEach((ws) => {
      if (ws) {
        ws.emit("Server has shutdown.")
        ws.destroy()
      }
    })

    server.close(() => {
      console.log("WebSocket server closed")
      process.exit(0)
    })

    // Force close after timeout in case some clients hang
    setTimeout(() => {
      console.warn("Forcing WebSocket shutdown")
      process.exit(1)
    }, 5000)
  }

  // Handle termination signals
  process.on("SIGINT", gracefulShutdown)
  process.on("SIGTERM", gracefulShutdown)
}

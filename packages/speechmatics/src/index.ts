import express from "express"
import http from "http"
import internal from "stream"
import dotenv from "dotenv"
import { handleWebSocket } from "./socket"

dotenv.config()
const PORT = process.env.PORT || 3117
const app = express()
const server = http.createServer(app)

const clients: Set<internal.Duplex> = new Set()

// Middleware
app.use(express.json())

// Simple Route
app.get("/", (req, res) => {
  res.send("Hello, Express!")
})

handleWebSocket(server, clients)
// Start Server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

// Gracefully close WebSocket connections on process termination
const gracefulShutdown = () => {
  console.log("Shutting down WebSocket server...")

  // Notify clients about server shutdown
  clients.forEach((ws) => {
    if (ws) {
      ws.emit("Server is shutting down...")
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

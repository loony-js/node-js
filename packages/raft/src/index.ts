import express from "express"
import http from "http"
import internal from "stream"
import dotenv from "dotenv"
import { handleWebSocket } from "./socket"
import { exit } from "process"
import fs from "fs"
import WebSocket from "ws"

dotenv.config()
const PORT = process.env.PORT

if (!PORT) {
  console.log("PORT not specified")
  exit()
}

const PEERS_FILE_PATH = process.env.PEERS_FILE_PATH
let PEERS: number[] = []
const CONNECTED_PEERS: WebSocket[] = []

const getPeers = () => {
  if (!PEERS_FILE_PATH) {
    exit()
  }
  try {
    const peers = fs.readFileSync(PEERS_FILE_PATH, "utf-8")
    if (peers) {
      const allPeers = JSON.parse(peers)
      PEERS = allPeers[PORT]
    }
  } catch (error) {
    console.log(error)
  }
}
getPeers()
const app = express()
const server = http.createServer(app)

const clients: Set<internal.Duplex> = new Set()

// Middleware
app.use(express.json())

// Simple Route
app.get("/", (req, res) => {
  res.send("Hello, Express!")
})

app.get("/connectPeers", (req, res) => {
  connectPeers()
  res.send("Ok")
})

app.get("/pingPeers", (req, res) => {
  if (CONNECTED_PEERS.length === 0) {
    res.send("Not connected to peers.")
  } else {
    CONNECTED_PEERS.forEach((peer) => {
      peer.send(`Hello from ${peer.url}`)
    })
    res.send("Ok")
  }
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

function connectPeers() {
  PEERS.forEach((peer) => {
    const url = `ws://localhost:${peer}`
    const ws = new WebSocket(url)
    ws.onopen = () => {
      console.log(`Connected to ${peer}`)
    }

    ws.onclose = () => {}

    ws.onmessage = () => {}

    CONNECTED_PEERS.push(ws)
  })
}

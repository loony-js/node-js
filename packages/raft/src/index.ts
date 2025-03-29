import express from "express"
import { handleWebSocket } from "./socket"
import WebSocket from "ws"
import { PEERS, PORT, WS_CLIENTS } from "./config"
import { app, server } from "./app"

const CONNECTED_PEERS: WebSocket[] = []
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

handleWebSocket(server, WS_CLIENTS)

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

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

import express from "express"
import { handleWebSocket } from "./socket"
import WebSocket from "ws"
import { PEERS, PORT, WS_CLIENTS } from "./config"
import { app, server } from "./app"
import { RaftNode } from "./node"

const CONNECTED_PEERS: WebSocket[] = []
// Middleware
app.use(express.json())
app.locals.RaftNode = new RaftNode(parseInt(PORT), CONNECTED_PEERS)
// Simple Route
app.get("/", (req, res) => {
  res.send("Hello, Express!")
})

app.get("/connectPeers", (req, res) => {
  connectPeers()
  res.send("Ok")
})

app.get("/pingPeers", (req, res) => {
  const raftNode: RaftNode = req.app.locals.RaftNode
  raftNode.pingPeers()
  res.send("Ok")
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

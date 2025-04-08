import express from "express"
// import { handleWebSocket } from "./socket"
import {
  PORT,
  // WS_CLIENTS,
  PEERS,
} from "./config"
import { app, server } from "./app"
import { RaftNode } from "./raft_node"
// import { RaftNode } from "./node"

// const raftNode = new RaftNode(parseInt(PORT))
// Middleware
app.use(express.json())
// app.locals.RaftNode = raftNode
// Simple Route
app.get("/", (req, res) => {
  res.send("Hello, Express!")
})

app.get("/connectPeers", (req, res) => {
  res.send("Ok")
})

app.get("/get", (req, res) => {
  res.send("Ok")
})

app.post("/set", (req, res) => {
  if (!req.body) {
    res.status(400).send("Body cannot be empty")
  }
  // const raftNode: RaftNode = req.app.locals.RaftNode
  // raftNode.set(req.body)
  res.send("Ok")
})

const node = new RaftNode(
  `${PORT}`,
  PEERS.map((peer) => {
    return `http://localhost:${peer}`
  }),
)

app.post("/vote", (req, res) => {
  node.handleVoteRequest(req, res)
})
app.post("/heartbeat", (req, res) => {
  node.handleHeartbeat(req, res)
})

// handleWebSocket(server, WS_CLIENTS, raftNode)

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

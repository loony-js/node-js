import express from "express"
// import { handleWebSocket } from "./socket"
import {
  PORT,
  // WS_CLIENTS,
  PEERS,
} from "./config"
import { app, server } from "./app"
import { RaftNode } from "./raft_node"
import { RaftLog, LogEntry } from "./raft_log"
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

const raftLog = new RaftLog()

app.post("/vote", (req, res) => {
  node.handleVoteRequest(req, res)
})
app.post("/heartbeat", (req, res) => {
  node.handleHeartbeat(req, res)
})

// Endpoint to accept a command from client
app.post("/command", (req, res) => {
  const { command } = req.body

  if (!command) {
    res.status(400).json({ error: "Missing command" })
    return
  }

  // Generate log entry
  const logEntry: LogEntry = {
    term: node.currentTerm,
    command,
  }

  // Append locally
  const success = raftLog.appendEntry(logEntry)

  if (!success) {
    res.status(500).json({ error: "Failed to append log" })
    return
  }

  raftLog.commit()

  res.json({ success: true, entry: logEntry })
})

// Get all log entries
app.get("/log", (req, res) => {
  const entries = raftLog.getEntries(0, 2)
  res.json(entries)
})

app.get("/status", (req, res) => {
  const entries = raftLog.status()
  res.json(entries)
})

// handleWebSocket(server, WS_CLIENTS, raftNode)

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

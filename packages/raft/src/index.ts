/* eslint-disable @typescript-eslint/no-explicit-any */
import { RaftNode } from "./raftNode-v1"
// import { GrpcHandler } from "./grpc.server"
import express from "express"
import http from "http"

import { HTTP_PORT, PEERS } from "./init"

const node = new RaftNode(HTTP_PORT, PEERS)

// const grpcServer = new GrpcHandler()
// grpcServer.start(GRPC_PORT)

const app = express()
const server = http.createServer(app)

// Middleware
app.use(express.json())

// Simple Route
app.get("/", (req, res) => {
  res.send("Hello, Express!")
})

app.post("/addNode", (req, res) => {
  node.addPeer(req.body.peerId)
  res.send("Ok")
})

app.post("/heartbeat", (req, res) => {
  node.handleHeartbeat(req.body)
  res.send("Ok")
})

app.post("/voteRequest", (req, res) => {
  res.send(node.handleVoteRequest(req.body))
})

app.post("/appendEntry", (req, res) => {
  node.handleAppendEntry(req.body)
  res.send("Ok")
})

// Start Server
server.listen(HTTP_PORT, () => {
  console.log(`HTTP Server is running on http://localhost:${HTTP_PORT}`)
})

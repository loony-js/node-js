import { RaftNode } from "./node"
import { app, server } from "./init"
import { GrpcHandler } from "./grpc.server"
import config from "./config"

const { getGrpcConfig, getHttpConfig } = config
const { GRPC_PORT, GRPC_PEERS } = getGrpcConfig()
const { HTTP_PORT } = getHttpConfig()

console.log(GRPC_PORT, GRPC_PEERS)
const node = new RaftNode(GRPC_PORT)
const grpcServer = new GrpcHandler()
grpcServer.setRaftNode(node)
grpcServer.addServices()

node.setGrpc(grpcServer)
grpcServer.addClients(GRPC_PEERS)

node.start()
grpcServer.start(GRPC_PORT)

// Simple Route
app.get("/", (req, res) => {
  res.send("Hello, Express!")
})

app.post("/set", (req, res) => {
  const { command } = req.body
  node.appendNewEntry(command)
  res.send("Ok.")
})

// Start Server
server.listen(HTTP_PORT, () => {
  console.log(`Server is running on http://localhost:${HTTP_PORT}`)
})

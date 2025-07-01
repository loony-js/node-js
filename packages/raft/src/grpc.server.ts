import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import EventEmitter from "node:events"
import path from "path"
import { RaftNode } from "./node"

type PeerInfo = {
  length: number
}

class GrpcHandler extends EventEmitter {
  server: grpc.Server
  grpcObject: grpc.GrpcObject
  raft: any
  clients: any
  connectedClients: number
  raftNode: RaftNode | undefined
  clientsMeta: Record<string, PeerInfo>

  constructor() {
    super()
    const packageDefinition = protoLoader.loadSync(
      path.resolve(__dirname, "protos/raft.proto"),
    )
    this.grpcObject = grpc.loadPackageDefinition(
      packageDefinition,
    ) as grpc.GrpcObject
    this.raft = this.grpcObject.raft
    this.server = new grpc.Server()
    this.clients = {}
    this.clientsMeta = {}
    this.connectedClients = 0
  }

  setRaftNode(node: RaftNode) {
    this.raftNode = node
  }

  status() {
    return {
      connectedClients: this.connectedClients,
      clientsMeta: this.clientsMeta,
    }
  }

  start(port: number) {
    this.server.bindAsync(
      `0.0.0.0:${port}`,
      grpc.ServerCredentials.createInsecure(),
      () => {
        console.log(`gRPC server running at http://0.0.0.0:${port}`)
      },
    )
    this.checkConnectedClients()
  }

  checkConnectedClients() {
    const x = setInterval(() => {
      if (this.connectedClients === this.clients.length) {
        clearInterval(x)
        return
      } else {
        this.connectedClients = 0
      }
      for (const peer in this.clients) {
        const client = this.clients[peer]
        client.IsAlive(
          {},
          (err: Error | null, response: { alive: boolean; node: any }) => {
            if (err) {
              console.error("Error:", err.message)
            } else {
              if (response.alive) {
                this.connectedClients += 1
                this.clientsMeta[peer] = response.node
              }
            }
          },
        )
      }
    }, 3000)
  }

  addServices() {
    this.server.addService(this.raft.RaftService.service, {
      OnHeartbeat: this.handleHeartbeat,
      OnVoteRequest: this.handleVoteRequest,
      OnAppendEntries: this.handleAppendEntry,
      IsAlive: this.nodeAlive,
    })
  }

  write(key: string, value: any, cb: any) {
    switch (key) {
      case "heartbeat":
        {
          for (const peer in this.clients) {
            const client = this.clients[peer]
            client.OnHeartbeat(value, cb)
          }
        }
        break
      case "voteRequest":
        {
          for (const peer in this.clients) {
            const client = this.clients[peer]
            client.OnVoteRequest(value, cb)
          }
        }
        break
      default:
        break
    }
  }

  appendEntry(value: any, peer: string, cb: any) {
    console.log("appendEntry", value, peer)
    const client = this.clients[peer]
    client.OnAppendEntries(value, cb)
  }

  nodeAlive = (
    call: grpc.ServerUnaryCall<null, { alive: boolean }>,
    callback: grpc.sendUnaryData<{ alive: boolean; node: any }>,
  ) => {
    callback(null, {
      alive: true,
      node: {
        length: this.raftNode?.log.len(),
      },
    })
  }

  addClient(port: number) {
    const peer = new this.raft.RaftService(
      `localhost:${port}`,
      grpc.credentials.createInsecure(),
    )
    this.clients[port] = peer
    console.log(`Client Id: ${port} added as peer.`)
  }

  addClients(ports: number[]) {
    ports.forEach((port) => {
      this.addClient(port)
    })
  }

  handleVoteRequest = (
    call: grpc.ServerUnaryCall<
      { term: number; candidateId: number },
      { voteGranted: boolean }
    >,
    callback: grpc.sendUnaryData<{ voteGranted: boolean }>,
  ) => {
    this.raftNode?.handleVoteRequest(call.request, callback)
  }

  handleHeartbeat = (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>,
  ) => {
    this.raftNode?.handleHeartbeat(call.request, callback)
  }

  handleAppendEntry = (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<{ success: boolean }>,
  ) => {
    this.raftNode?.handleAppendEntries(call.request, callback)
  }
}

export { GrpcHandler }
export default GrpcHandler

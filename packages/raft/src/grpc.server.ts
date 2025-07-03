import * as grpc from "@grpc/grpc-js"
import service from "../generated/raft_grpc_pb"
import messages, {
  AliveReq,
  AliveRes,
  AppendEntriesReq,
  AppendEntriesRes,
  VoteReq,
  VoteRes,
} from "../generated/raft_pb"

import EventEmitter from "node:events"
import { AppendEntriesRPC, RaftNode } from "./node"

type PeerInfo = {
  length: number
  nextIndex: number
  matchIndex: number
}

class GrpcHandler extends EventEmitter {
  ports: number[]
  server: grpc.Server
  raftService: any
  clients: Record<number, service.RaftServiceClient>
  connectedClients: number
  raftNode: RaftNode | undefined
  clientsMeta: Record<string, PeerInfo>

  constructor() {
    super()
    this.server = new grpc.Server()
    this.clients = {}
    this.clientsMeta = {}
    this.connectedClients = 0
    this.ports = []
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

  private checkConnectedClients() {
    const x = setInterval(() => {
      if (this.connectedClients === Object.entries(this.clients).length) {
        clearInterval(x)
        console.log(`checkConnectedClients interval cleared.`)
        return
      } else {
        console.log(this.connectedClients, "ConnectedClients")
        this.connectedClients = 0
        for (const peer of this.ports) {
          const client = this.clients[peer]
          const request = new messages.AliveReq()
          client.isAlive(request, (err, response) => {
            if (err) {
              console.error("Error:", err.message)
            } else {
              if (response.getAlive() && response.getNode()) {
                const node = response.getNode()
                if (node) {
                  this.connectedClients += 1
                  this.clientsMeta[peer] = {
                    length: node.getLength(),
                    nextIndex: node.getLength(),
                    matchIndex: node.getLength() - 1,
                  }
                }
              }
            }
          })
        }
      }
    }, 3000)
  }

  addServices() {
    this.server.addService(service.RaftServiceService, {
      heartbeat: this.handleHeartbeat,
      voteRequest: this.handleVoteRequest,
      appendEntries: this.handleAppendEntry,
      isAlive: this.nodeAlive,
    })
  }

  write(key: string, value: any, cb: any) {
    switch (key) {
      case "heartbeat":
        {
          for (const peer of this.ports) {
            const client = this.clients[peer]
            const request = new messages.AppendEntriesReq()
            request.setTerm(value.term)
            request.setLeaderid(value.leaderId)
            request.setPrevlogindex(value.prevLogIndex)
            request.setPrevlogterm(value.prevLogTerm)
            request.setEntries(value.entries)
            request.setLeadercommit(value.leaderCommit)
            client.heartbeat(
              request,
              (err, response: messages.AppendEntriesRes) => {
                cb(err, response)
              },
            )
          }
        }
        break
      case "voteRequest":
        {
          for (const peer of this.ports) {
            const client = this.clients[peer]
            const request = new messages.VoteReq()
            request.setCandidateid(value.candidateId)
            request.setTerm(value.term)
            client.voteRequest(request, (err, response: messages.VoteRes) => {
              cb(err, response)
            })
          }
        }
        break
      default:
        break
    }
  }

  appendEntry(value: AppendEntriesRPC, peer: number, cb: any) {
    const client = this.clients[peer]
    const request = new messages.AppendEntriesReq()
    request.setTerm(value.term)
    request.setLeaderid(value.leaderId)
    request.setPrevlogindex(value.prevLogIndex)
    request.setPrevlogterm(value.prevLogTerm)
    request.setEntries(value.entries)
    request.setLeadercommit(value.leaderCommit)
    client.appendEntries(request, (err, response) => {
      if (!err) {
        cb(response.getSuccess())
      }
    })
  }

  private addClient(port: number) {
    const peer = new service.RaftServiceClient(
      `localhost:${port}`,
      grpc.credentials.createInsecure(),
    )
    this.clients[port] = peer
    console.log(`Client Id: ${port} added as peer.`)
  }

  addClients(ports: number[]) {
    this.ports = ports
    ports.forEach((port) => {
      this.addClient(port)
    })
  }

  private nodeAlive = (
    call: grpc.ServerUnaryCall<AliveReq, AliveRes>,
    callback: grpc.sendUnaryData<AliveRes>,
  ) => {
    const reply = new messages.AliveRes()
    if (this.raftNode) {
      reply.setAlive(true)
      const nodeInfo = new messages.NodeInfo()
      nodeInfo.setLength(this.raftNode.log.len())
      reply.setNode(nodeInfo)
      callback(null, reply)
    } else {
      reply.setAlive(false)
      const nodeInfo = new messages.NodeInfo()
      nodeInfo.setLength(0)
      reply.setNode(nodeInfo)
      callback(null, reply)
    }
  }

  private handleVoteRequest = (
    call: grpc.ServerUnaryCall<VoteReq, VoteRes>,
    callback: grpc.sendUnaryData<VoteRes>,
  ) => {
    const reply = new messages.VoteRes()
    if (this.raftNode) {
      const res = this.raftNode.handleVoteRequest(call.request)
      reply.setVotegranted(res.voteGranted)
      callback(null, reply)
    } else {
      reply.setVotegranted(false)
      callback(null, reply)
    }
  }

  private handleHeartbeat = (
    call: grpc.ServerUnaryCall<AppendEntriesReq, AppendEntriesRes>,
    callback: grpc.sendUnaryData<AppendEntriesRes>,
  ) => {
    const res = this.raftNode?.handleHeartbeat(call.request)
    const reply = new messages.AppendEntriesRes()
    reply.setSuccess(res?.result || false)
    callback(null, reply)
  }

  private handleAppendEntry = (
    call: grpc.ServerUnaryCall<AppendEntriesReq, AppendEntriesRes>,
    callback: grpc.sendUnaryData<AppendEntriesRes>,
  ) => {
    const res = this.raftNode?.handleAppendEntries(call.request)
    const reply = new messages.AppendEntriesRes()
    reply.setSuccess(res?.success || false)
    callback(null, reply)
  }
}

export { GrpcHandler }
export default GrpcHandler

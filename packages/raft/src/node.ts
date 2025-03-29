import { Log, NodeLogs } from "./logs"
import WebSocket from "ws"

type Follower = 1
type Candidate = 2
type Leader = 3

type NodeType = Follower | Candidate | Leader

export class RaftNode {
  id: number
  peers: WebSocket[]
  term: number
  nodeType: NodeType
  logs: NodeLogs

  constructor(id: number, peers: WebSocket[]) {
    this.id = id
    this.peers = peers
    this.term = 0
    this.nodeType = 1
    this.logs = new NodeLogs()
  }

  addNode(node: WebSocket) {
    this.peers.push(node)
  }

  addNodes(node: WebSocket[]) {
    this.peers.concat(node)
  }

  getPeers() {
    return this.peers
  }

  pingPeers() {
    this.peers.forEach((peer) => {
      peer.send(
        JSON.stringify({
          event: "PING",
          data: "Hello",
        }),
      )
    })
  }

  get() {}

  set(data: Log) {
    this.logs.push(data)
    this.peers.forEach((peer) => {
      peer.send(
        JSON.stringify({
          event: "INSERT",
          data,
        }),
      )
    })
  }

  insert(data: Log) {
    this.logs.push(data)
    console.log(this.logs, "INSERT")
  }
}

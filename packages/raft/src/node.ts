import WebSocket from "ws"
import { PEERS } from "./config"
import { Log, NodeLogs } from "./logs"

type Follower = 1
type Candidate = 2
type Leader = 3

export type NodeType = Follower | Candidate | Leader

export class ConnectedPeers {
  peers: WebSocket[] = []
  constructor(peers = []) {
    this.peers = peers
  }
  add(peer: WebSocket) {
    this.peers.push(peer)
  }

  send(data: Log) {
    this.peers.forEach((peer) => {
      peer.send(JSON.stringify(data))
    })
  }

  ping(data: string) {
    this.peers.forEach((peer) => {
      peer.send(data)
    })
  }

  delete() {}
}

export class RaftNode {
  id: number
  peers: ConnectedPeers | undefined
  term: number
  nodeType: NodeType
  logs: NodeLogs

  constructor(id: number) {
    this.id = id
    this.term = 0
    this.nodeType = 1
    this.logs = new NodeLogs()
  }

  setNodeType(nodeType: NodeType) {
    this.nodeType = nodeType
  }

  startListening() {
    if (this.nodeType === 3) {
      setInterval(() => {
        this.peers?.ping("PING")
      }, 3000)
    }
  }

  getPeers() {
    return this.peers
  }

  set(data: Log) {
    this.logs.push(data)
    this.peers?.send(data)
  }

  insert(data: Log) {
    this.logs.push(data)
    console.log(this.logs, "INSERT")
  }

  connectPeers() {
    this.peers = connectPeers()
  }
}

function connectPeers() {
  const peers = new ConnectedPeers()
  PEERS.forEach((peer) => {
    const url = `ws://localhost:${peer}`
    const ws = new WebSocket(url)
    ws.onopen = () => {
      console.log(`Connected to ${peer}`)
    }

    ws.onclose = () => {}

    ws.onmessage = () => {}
    peers.add(ws)
  })
  return peers
}

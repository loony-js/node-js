/* eslint-disable @typescript-eslint/no-explicit-any */
// deno-lint-ignore-file

import EventEmitter from "node:events"
// import * as grpc from "@grpc/grpc-js"

interface LogEntry {
  term: number
  command: string
}

const HEARTBEAT_INTERVAL = 1500
const ELECTION_TIMER = 3000

enum RAFT_STATE {
  STOPPED = 0,
  LEADER = 1,
  CANDIDATE = 2,
  FOLLOWER = 3,
  CHILD = 4,
}

export enum MESSAGE {
  TERM_CHANGE = "TC",
  STATE_CHANGE = "SC",
  DATA = "DATA",
  PING = "PING",
}

export type Packet = {
  state: number
  term: number
  address: number
  type: string
  leader: number | null
  candidateId?: number
  leaderId?: number
  last?: any // Mark as optional since it's conditionally added
  entry?: any // Also optional
}

export class RaftNode extends EventEmitter {
  id: number
  peers: string[]
  // peers: ConnectedPeers | undefined

  state: RAFT_STATE
  term: number
  vote: {
    for: number | null
    granted: number
  }
  log: LogEntry[]
  // commitIndex: number
  // lastApplied: number
  leaderId: number | null
  electionTimeout: number
  heartbeatInterval: number
  electionTimer: NodeJS.Timeout | null
  write: any

  constructor(id: number, peers: any | undefined) {
    super()
    this.id = id
    this.state = RAFT_STATE.FOLLOWER
    this.term = 0
    this.vote = {
      for: null,
      granted: 0,
    }
    this.log = []
    // this.commitIndex = 0
    // this.lastApplied = 0
    this.leaderId = null
    this.electionTimeout = this.resetElectionTimeout()
    this.heartbeatInterval = 1500
    this.electionTimer = null
    this.peers = peers.map((p: number) => `http://localhost:${p}`)
    this.__initialize()
  }

  __initialize() {
    this.startElectionTimer()
  }

  addPeer(peer: string) {
    this.peers.push(peer)
    if (this.peers.length >= 3) {
      this.startElectionTimer()
    }
  }

  resetElectionTimeout(): number {
    return Math.floor(
      Math.random() * (ELECTION_TIMER - HEARTBEAT_INTERVAL) +
        HEARTBEAT_INTERVAL,
    )
  }

  startElectionTimer(): void {
    if (this.electionTimer) clearTimeout(this.electionTimer)
    this.electionTimer = setTimeout(
      () => this.startElection(),
      this.electionTimeout,
    )
  }

  async startElection(): Promise<void> {
    this.state = RAFT_STATE.CANDIDATE
    this.term++
    this.vote = {
      for: this.id,
      granted: 1,
    }
    console.log(`Node ${this.id} is starting an election for term ${this.term}`)

    const handleVotes = () => {
      if (this.vote.granted > Math.floor((this.peers.length + 1) / 2)) {
        this.becomeLeader()
      } else {
        this.startElectionTimer()
      }
    }

    await Promise.all(
      this.peers.map(async (peer) => {
        const url = `${peer}/voteRequest`
        const body = {
          term: this.term,
          candidateId: this.id,
        }
        post(url, body)
          .then((res: any) => {
            if (res.voteGranted) this.vote.granted++
            handleVotes()
          })
          .catch(() => {})
      }),
    )
  }

  becomeLeader(): void {
    this.state = RAFT_STATE.LEADER
    this.leaderId = this.id
    console.log(`Node ${this.id} is now the leader`)
    this.sendHeartbeats()
  }

  async sendHeartbeats(): Promise<void> {
    if (this.state !== RAFT_STATE.LEADER) return

    setInterval(async () => {
      await Promise.all(
        this.peers.map(async (peer) => {
          const url = `${peer}/heartbeat`
          const body = {
            term: this.term,
            leaderId: this.id,
          }
          post(url, body).catch(() => {})
        }),
      )
    }, this.heartbeatInterval)
  }

  handleVoteRequest(packet: Packet): any {
    const { term, candidateId } = packet
    if (term > this.term) {
      this.term = term
      if (candidateId) {
        this.vote.for = candidateId
      }
      this.startElectionTimer()
      return {
        voteGranted: true,
      }
    } else {
      return {
        voteGranted: false,
      }
    }
  }

  handleHeartbeat(packet: Packet): boolean {
    const { term, leaderId } = packet
    if (term >= this.term) {
      this.term = term
      if (leaderId) {
        this.leaderId = leaderId
      }
      this.state = RAFT_STATE.FOLLOWER
      this.startElectionTimer()
    }
    if (term / 10 === 0) {
      console.clear()
    }
    return true
  }

  async sendLogAppendEntryToPeers(entry: LogEntry) {
    await Promise.all(
      this.peers.map(async (peer) => {
        const url = `${peer}/appendEntry`
        const body = {
          term: this.term,
          entry,
        }
        post(url, body).catch(() => {})
      }),
    )
  }

  handleAppendEntry(packet: Packet) {
    if (packet.term === this.term) {
      this.log.push(packet.entry)
    }
  }
}

const post = async (url: string, body: any) => {
  return new Promise((resolve, reject) => {
    try {
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    } catch (error: any) {
      reject(error)
      console.error("Vote request failed", error.message)
    }
  })
}

/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */
// deno-lint-ignore-file
import * as grpc from "@grpc/grpc-js"
import EventEmitter from "node:events"
import GrpcHandler from "./grpc.server"
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
  grpc: GrpcHandler | undefined

  constructor(id: number) {
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
  }

  start() {
    this.startElectionTimer()
  }

  setGrpc(grpc: GrpcHandler) {
    this.grpc = grpc
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
    const raft = this
    this.state = RAFT_STATE.CANDIDATE
    this.term++
    this.vote = {
      for: this.id,
      granted: 1,
    }
    console.log(`Node ${this.id} is starting an election for term ${this.term}`)

    const handleVotes = () => {
      if (
        this.grpc?.connectedClients &&
        this.vote.granted > Math.floor((this.grpc?.connectedClients + 1) / 2)
      ) {
        this.becomeLeader()
      } else {
        this.startElectionTimer()
      }
    }

    if (this.grpc) {
      this.grpc?.clients.map(async (peer) => {
        peer.OnVoteRequest(
          { term: raft.term, candidateId: raft.id },
          (err: Error | null, response: { voteGranted: boolean }) => {
            if (err) {
              console.error("Error:", err.message)
            } else {
              if (response.voteGranted) {
                raft.vote.granted++
              }
            }
            handleVotes()
          },
        )
      })
    }
  }

  becomeLeader(): void {
    this.state = RAFT_STATE.LEADER
    this.leaderId = this.id
    console.log(`Node ${this.id} is now the leader`)
    this.sendHeartbeats()
  }

  async sendHeartbeats(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const raft = this
    if (this.state !== RAFT_STATE.LEADER) return

    setInterval(async () => {
      if (this.grpc) {
        await Promise.all(
          this.grpc?.clients.map(async (peer) => {
            peer.OnHeartbeat(
              { term: raft.term, leaderId: raft.id },
              (err: Error | null) => {
                if (err) {
                  console.error("Error:", err)
                }
              },
            )
          }),
        )
      }
    }, this.heartbeatInterval)
  }

  handleVoteRequest(
    { term, candidateId }: { term: number; candidateId: number },
    callback: grpc.sendUnaryData<{ voteGranted: boolean }>,
  ): any {
    if (term > this.term) {
      this.term = term
      if (candidateId) {
        this.vote.for = candidateId
      }
      this.startElectionTimer()
      callback(null, { voteGranted: true })
    } else {
      callback(null, { voteGranted: false })
    }
  }

  handleHeartbeat(
    { term, leaderId }: { term: number; leaderId: number },
    callback: grpc.sendUnaryData<any>,
  ) {
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
    callback(null, { result: true })
  }

  //   async sendLogAppendEntryToPeers(entry: LogEntry) {
  //     // await Promise.all(
  //     //   this.peers.map(async (peer) => {
  //     //     const url = `${peer}/appendEntry`
  //     //     const body = {
  //     //       term: this.term,
  //     //       entry,
  //     //     }
  //     //     post(url, body).catch(() => {})
  //     //   }),
  //     // )
  //   }

  handleAppendEntry(packet: Packet) {
    if (packet.term === this.term) {
      this.log.push(packet.entry)
    }
  }
}

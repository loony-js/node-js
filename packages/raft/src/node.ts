/* eslint-disable @typescript-eslint/no-unused-vars */
import * as grpc from "@grpc/grpc-js"
import EventEmitter from "node:events"
import GrpcHandler from "./grpc.server"
import { RaftLog } from "./log"
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

export type AppendEntriesRPC = {
  term: number
  leaderId: number
  prevLogIndex: number
  prevLogTerm: number
  entries: string
  leaderCommit: number
}

export class RaftNode extends EventEmitter {
  id: number

  state: RAFT_STATE
  term: number
  vote: {
    for: number | null
    granted: number
  }
  log: RaftLog
  leaderId: number | null
  electionTimeout: number
  heartbeatInterval: number
  electionTimer: NodeJS.Timeout | null
  write: any
  grpc: GrpcHandler | undefined
  commitIndex: number
  lastApplied: number
  prevLogIndex: number
  states: any

  constructor(id: number, peers: number[]) {
    super()
    this.id = id
    this.state = RAFT_STATE.FOLLOWER
    this.term = 0
    this.vote = {
      for: null,
      granted: 0,
    }
    this.log = new RaftLog()
    this.leaderId = null
    this.electionTimeout = this.resetElectionTimeout()
    this.heartbeatInterval = 1500
    this.electionTimer = null
    this.commitIndex = -1
    this.lastApplied = -1
    this.prevLogIndex = -1

    this.states = {}
  }

  status() {
    return {
      commitIndex: this.commitIndex,
      lastApplied: this.lastApplied,
      prevLogIndex: this.prevLogIndex,
      state: this.state,
      term: this.term,
      leaderId: this.leaderId,
      id: this.id,
    }
  }

  logStatus() {
    return this.log.status()
  }

  getAllEntries() {
    return this.log.getEntriesFrom(0)
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

    const cb = (err: Error | null, response: { voteGranted: boolean }) => {
      if (err) {
        console.error("Error:", err.message)
      } else {
        if (response.voteGranted) {
          this.vote.granted++
        }
      }
      handleVotes()
    }
    const { term, id } = this
    this.grpc?.write("voteRequest", { term, candidate: id }, cb)
  }

  becomeLeader(): void {
    this.state = RAFT_STATE.LEADER
    this.leaderId = this.id
    console.log(`Node ${this.id} is now the leader`)
    this.sendHeartbeats()
  }

  async sendHeartbeats() {
    if (this.state !== RAFT_STATE.LEADER) return

    setInterval(() => {
      this.grpc?.write(
        "heartbeat",
        { term: this.term, leaderId: this.id },
        (err: Error | null) => {
          if (err) {
            console.error("Error:", err)
          }
        },
      )
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

  handleAppendEntries(rpc: AppendEntriesRPC, cb: any) {
    console.log("handleAppendEntries", rpc)

    // 1. Reply false if term < currentTerm (§5.1)
    if (rpc.term < this.term) {
      cb(null, {
        success: false,
      })
      return
    }

    // 2. If rpc.term > this.term, update this.term and convert to follower
    if (rpc.term > this.term) {
      this.term = rpc.term
      this.state = RAFT_STATE.FOLLOWER
      this.vote = {
        for: null,
        granted: 0,
      }
    }

    this.leaderId = rpc.leaderId
    // 3. Reply false if log doesn't contain an entry at prevLogIndex
    //    whose term matches prevLogTerm (§5.3)
    if (
      rpc.prevLogIndex >= 0 &&
      (rpc.prevLogIndex >= this.log.len() ||
        // this.log[rpc.prevLogIndex].term !== rpc.prevLogTerm
        this.log.getLogTermForIndex(rpc.prevLogIndex) !== rpc.prevLogTerm)
    ) {
      cb(null, {
        success: false,
      })
      return
    }

    const entries = JSON.parse(rpc.entries)
    // 4. If an existing entry conflicts with a new one (same index but different terms),
    //    delete the existing entry and all that follow it (§5.3)
    for (let i = 0; i < entries.length; i++) {
      const index = rpc.prevLogIndex + 1 + i
      const incoming = entries[i]

      if (index < this.log.len()) {
        if (this.log.getLogTermForIndex(index) !== incoming.term) {
          // Conflict found, delete all entries from this point
          this.log.updateEntries(0, index)
          break
        }
      }
    }

    // 5. Append any new entries not already in the log
    for (let i = 0; i < entries.length; i++) {
      const index = rpc.prevLogIndex + 1 + i
      if (index >= this.log.len()) {
        this.log.appendEntry(entries[i])
      }
    }

    // 6. If leaderCommit > commitIndex, set commitIndex = min(leaderCommit, index of last new entry)
    if (rpc.leaderCommit > this.commitIndex) {
      const lastNewIndex = rpc.prevLogIndex + entries.length
      this.commitIndex = Math.min(rpc.leaderCommit, lastNewIndex)
      this.applyCommittedEntries()
    }

    cb(null, {
      success: true,
    })
  }

  applyCommittedEntries() {
    while (this.lastApplied < this.commitIndex) {
      this.lastApplied++
      const entry = this.log.getEntry(this.lastApplied)
      this.apply(entry.command)
    }
  }

  apply(command: any) {
    console.log(`[${this.id}] Applying command:`, command)
    // Apply command to state machine
  }

  appendNewEntry(command: any) {
    if (this.state !== RAFT_STATE.LEADER) return

    this.log.appendEntry({ term: this.term, command })
    // const newIndex = this.log.length - 1

    if (this.grpc) {
      for (const peer in this.grpc.clients) {
        this.sendAppendEntries(peer)
      }
    }
  }

  // Send AppendEntries RPC to a follower
  sendAppendEntries(peer: string, overrideEntries?: LogEntry[]) {
    const follower = this.grpc?.clientsMeta[peer]
    if (!follower) {
      return
    }
    const nextIdx = follower.length
    const prevLogIndex = nextIdx - 1

    const prevLogTerm =
      prevLogIndex >= 0 ? this.log.getLogTermForIndex(prevLogIndex) : -1

    const entries =
      overrideEntries !== undefined
        ? overrideEntries
        : this.log.getEntriesFrom(nextIdx)

    const rpc: AppendEntriesRPC = {
      term: this.term,
      leaderId: this.id,
      prevLogIndex,
      prevLogTerm,
      entries: JSON.stringify(entries),
      leaderCommit: this.commitIndex,
    }

    this.sendRPC(peer, rpc)
  }

  // Simulated network send
  sendRPC(peer: string, rpc: AppendEntriesRPC) {
    const run = (success: boolean) => {
      this.onAppendEntriesResponse(success, peer)
    }
    this.grpc?.appendEntry(rpc, peer, run)
  }

  // Simulated follower response handler
  onAppendEntriesResponse(success: boolean, peer: string) {
    const follower = this.grpc?.clients[peer]
    if (success) {
      follower.length += 1
      // follower.matchIndex = this.log.len() - 1
      // follower.nextIndex = follower.matchIndex + 1
    } else {
      // follower.nextIndex = Math.max(0, follower.nextIndex - 1)
      // this.sendAppendEntries(followerId) // retry
    }
    this.updateCommitIndex()
  }

  updateCommitIndex() {
    // const matchIndices = Object.values(this.followers)
    //   .map((f) => f.matchIndex)
    //   .concat(this.log.length - 1) // include leader's index
    //   .sort((a, b) => b - a)
    // const majorityMatch = matchIndices[Math.floor(this.peers.length / 2)]
    // if (
    //   majorityMatch > this.commitIndex &&
    //   this.log[majorityMatch].term === this.currentTerm
    // ) {
    //   this.commitIndex = majorityMatch
    //   console.log(`Commit index updated to ${this.commitIndex}`)
    // }
  }
}

import * as grpc from "@grpc/grpc-js"
import EventEmitter from "node:events"
import GrpcHandler from "./grpc.server"
import { RaftLog } from "./log"
import messages, { AppendEntriesReq, VoteReq } from "../generated/raft_pb"

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
  last?: any
  entry?: any
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

  constructor(id: number) {
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
      id: this.id,
      term: this.term,
      state: this.state,
      leaderId: this.leaderId,
      commitIndex: this.commitIndex,
      lastApplied: this.lastApplied,
      prevLogIndex: this.prevLogIndex,
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

    const cb = (err: grpc.ServiceError, res: messages.VoteRes) => {
      if (err) {
        console.error("Error:", err.message)
      } else {
        if (res.getVotegranted()) {
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
      const cb = (err: grpc.ServiceError) => {
        if (err) {
          console.error("Error:", err)
        }
      }
      const prevLogIndex = this.log.len() - 1
      const prevLogTerm =
        prevLogIndex >= 0 ? this.log.getLogTerm(prevLogIndex) : 0
      this.grpc?.write(
        "heartbeat",
        {
          term: this.term,
          leaderId: this.id,
          prevLogIndex,
          prevLogTerm,
          entries: JSON.stringify([]),
          leaderCommit: this.commitIndex,
        },
        cb,
      )
    }, this.heartbeatInterval)
  }

  handleVoteRequest(req: VoteReq): { voteGranted: boolean } {
    const term = req.getTerm()
    const candidateId = req.getCandidateid()
    if (term > this.term) {
      this.term = term
      if (candidateId) {
        this.vote.for = candidateId
      }
      this.startElectionTimer()
      return { voteGranted: true }
    } else {
      return { voteGranted: false }
    }
  }

  handleHeartbeat(req: AppendEntriesReq): {
    result: boolean
  } {
    const term = req.getTerm()
    const leaderId = req.getLeaderid()
    const leaderCommit = req.getLeadercommit()
    const prevLogIndex = req.getPrevlogindex()
    const allEntries = req.getEntries()
    const entries = JSON.parse(allEntries)

    if (leaderCommit > this.commitIndex) {
      const lastNewIndex = prevLogIndex + entries.length
      this.commitIndex = Math.min(leaderCommit, lastNewIndex)
      this.applyCommittedEntries()
    }

    if (term >= this.term) {
      this.term = term
      if (leaderId) {
        this.leaderId = leaderId
      }
      this.state = RAFT_STATE.FOLLOWER
      this.startElectionTimer()
    }

    return { result: true }
  }

  handleAppendEntries(req: AppendEntriesReq): { success: boolean } {
    console.log(`Received append entry.`)
    const term = req.getTerm()
    const leaderId = req.getLeaderid()
    const prevLogIndex = req.getPrevlogindex()
    const prevLogTerm = req.getPrevlogterm()
    const reqEntries = req.getEntries()
    const leaderCommit = req.getLeadercommit()

    if (term < this.term) {
      return {
        success: false,
      }
    }

    if (term > this.term) {
      this.term = term
      this.state = RAFT_STATE.FOLLOWER
      this.vote = {
        for: null,
        granted: 0,
      }
    }

    this.leaderId = leaderId
    if (
      prevLogIndex >= 0 &&
      (prevLogIndex >= this.log.len() ||
        this.log.getLogTermForIndex(prevLogIndex) !== prevLogTerm)
    ) {
      return {
        success: false,
      }
    }

    const entries = JSON.parse(reqEntries)
    for (let i = 0; i < entries.length; i++) {
      const index = prevLogIndex + 1 + i
      const incoming = entries[i]

      if (index < this.log.len()) {
        if (this.log.getLogTermForIndex(index) !== incoming.term) {
          this.log.updateEntries(0, index)
          break
        }
      }
    }

    for (let i = 0; i < entries.length; i++) {
      const index = prevLogIndex + 1 + i
      if (index >= this.log.len()) {
        this.log.appendEntry(entries[i])
      }
    }

    if (leaderCommit > this.commitIndex) {
      const lastNewIndex = prevLogIndex + entries.length
      this.commitIndex = Math.min(leaderCommit, lastNewIndex)
      this.applyCommittedEntries()
    }

    return {
      success: true,
    }
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

    if (this.grpc) {
      for (const peer of this.grpc.ports) {
        this.sendAppendEntries(peer)
      }
    }
  }

  sendAppendEntries(peer: number, overrideEntries?: LogEntry[]) {
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
  sendRPC(peer: number, rpc: AppendEntriesRPC) {
    const run = (success: boolean) => {
      this.onAppendEntryResponse(success, peer)
    }
    this.grpc?.appendEntry(rpc, peer, run)
  }

  // Simulated follower response handler
  onAppendEntryResponse(success: boolean, peer: number) {
    const follower = this.grpc?.clientsMeta[peer]
    if (success && follower) {
      follower.length = +1
      follower.matchIndex = follower.length - 1
      follower.nextIndex = follower.length
    } else if (follower) {
      follower.nextIndex = Math.max(0, follower.nextIndex - 1)
      this.sendAppendEntries(peer) // retry
    }
    this.updateCommitIndex()
  }

  updateCommitIndex() {
    const followers = this.grpc?.clientsMeta
    if (followers) {
      const matchIndices = Object.values(followers)
        .map((f) => f.matchIndex)
        .concat(this.log.len() - 1) // include leader's index
        .sort((a, b) => b - a)
      const majorityMatch =
        matchIndices[Math.floor(Object.entries(followers).length / 2)]
      if (
        majorityMatch > this.commitIndex &&
        this.log.getEntry(majorityMatch).term === this.term
      ) {
        this.commitIndex = majorityMatch
        console.log(`Commit index updated to ${this.commitIndex}`)
      }
    }
  }
}

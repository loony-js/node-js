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

export type AppendEntriesRPC = {
  term: number
  leaderId: number
  prevLogIndex: number
  prevLogTerm: number
  entries: any[]
  leaderCommit: number
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
  commitIndex: number
  lastApplied: number

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
    this.commitIndex = -1
    this.lastApplied = -1
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
      for (const peer in this.grpc.clients) {
        const client = this.grpc.clients[peer]
        client.OnVoteRequest(
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
      }
    }
  }

  becomeLeader(): void {
    this.state = RAFT_STATE.LEADER
    this.leaderId = this.id
    console.log(`Node ${this.id} is now the leader`)
    this.sendHeartbeats()
  }

  async sendHeartbeats() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const raft = this
    if (this.state !== RAFT_STATE.LEADER) return

    setInterval(() => {
      if (this.grpc) {
        for (const peer in this.grpc.clients) {
          const client = this.grpc?.clients[peer]
          client.OnHeartbeat(
            { term: raft.term, leaderId: raft.id },
            (err: Error | null) => {
              if (err) {
                console.error("Error:", err)
              }
            },
          )
        }
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
    console.log(`Received Heartbeat. Term: ${term}. LeaderId: ${leaderId}`)
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

  handleAppendEntries(rpc: AppendEntriesRPC): boolean {
    // 1. Reply false if term < currentTerm (§5.1)
    if (rpc.term < this.term) {
      return false
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
      (rpc.prevLogIndex >= this.log.length ||
        this.log[rpc.prevLogIndex].term !== rpc.prevLogTerm)
    ) {
      return false
    }

    // 4. If an existing entry conflicts with a new one (same index but different terms),
    //    delete the existing entry and all that follow it (§5.3)
    for (let i = 0; i < rpc.entries.length; i++) {
      const index = rpc.prevLogIndex + 1 + i
      const incoming = rpc.entries[i]

      if (index < this.log.length) {
        if (this.log[index].term !== incoming.term) {
          // Conflict found, delete all entries from this point
          this.log = this.log.slice(0, index)
          break
        }
      }
    }

    // 5. Append any new entries not already in the log
    for (let i = 0; i < rpc.entries.length; i++) {
      const index = rpc.prevLogIndex + 1 + i
      if (index >= this.log.length) {
        this.log.push(rpc.entries[i])
      }
    }

    // 6. If leaderCommit > commitIndex, set commitIndex = min(leaderCommit, index of last new entry)
    if (rpc.leaderCommit > this.commitIndex) {
      const lastNewIndex = rpc.prevLogIndex + rpc.entries.length
      this.commitIndex = Math.min(rpc.leaderCommit, lastNewIndex)
      this.applyCommittedEntries()
    }

    return true
  }

  applyCommittedEntries() {
    while (this.lastApplied < this.commitIndex) {
      this.lastApplied++
      const entry = this.log[this.lastApplied]
      this.apply(entry.command)
    }
  }

  apply(command: any) {
    console.log(`[${this.id}] Applying command:`, command)
    // Apply command to state machine
  }

  appendNewEntry(command: any) {
    if (this.state !== RAFT_STATE.LEADER) return

    this.log.push({ term: this.term, command })
    // const newIndex = this.log.length - 1

    if (this.grpc) {
      for (const followerId of this.grpc.clients) {
        this.sendAppendEntries(followerId)
      }
    }
  }

  // Send AppendEntries RPC to a follower
  sendAppendEntries(followerId: string, overrideEntries?: LogEntry[]) {
    const follower = this.grpc?.clients[followerId]
    const nextIdx = follower.nextIndex

    const prevLogIndex = nextIdx - 1
    const prevLogTerm = prevLogIndex >= 0 ? this.log[prevLogIndex].term : -1

    const entries =
      overrideEntries !== undefined ? overrideEntries : this.log.slice(nextIdx)

    const rpc: AppendEntriesRPC = {
      term: this.currentTerm,
      leaderId: this.id,
      prevLogIndex,
      prevLogTerm,
      entries,
      leaderCommit: this.commitIndex,
    }

    this.sendRPC(followerId, rpc)
  }

  // Simulated network send
  sendRPC(followerId: string, rpc: AppendEntriesRPC) {
    console.log(`Sending AppendEntries to ${followerId}`, rpc)
    // Implement actual network call or messaging system here
  }

  // Simulated follower response handler
  onAppendEntriesResponse(followerId: string, success: boolean) {
    const follower = this.followers[followerId]
    if (success) {
      follower.matchIndex = this.log.length - 1
      follower.nextIndex = follower.matchIndex + 1
    } else {
      follower.nextIndex = Math.max(0, follower.nextIndex - 1)
      this.sendAppendEntries(followerId) // retry
    }

    this.updateCommitIndex()
  }

  updateCommitIndex() {
    const matchIndices = Object.values(this.followers)
      .map((f) => f.matchIndex)
      .concat(this.log.length - 1) // include leader's index
      .sort((a, b) => b - a)

    const majorityMatch = matchIndices[Math.floor(this.peers.length / 2)]
    if (
      majorityMatch > this.commitIndex &&
      this.log[majorityMatch].term === this.currentTerm
    ) {
      this.commitIndex = majorityMatch
      console.log(`Commit index updated to ${this.commitIndex}`)
    }
  }
}

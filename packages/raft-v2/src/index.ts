/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * raft.ts
 *
 * A self-contained, educational implementation of the Raft consensus algorithm in TypeScript.
 * This focuses on clarity and correctness of core Raft concepts (leader election, log replication,
 * and safety) rather than performance or production-readiness.
 *
 * Features:
 * - Node roles: Follower, Candidate, Leader
 * - Persistent state (term, votedFor, log) (kept in-memory here but API hooks are present)
 * - RequestVote and AppendEntries RPCs with handlers
 * - Leader election with randomized timeouts
 * - Log replication and commit mechanism
 * - Simple network abstraction (pluggable transport) and an in-memory simulator
 * - Example simulation at the bottom showing a small cluster
 *
 * Usage: load in ts-node or compile with tsc. This file is intentionally single-file to make
 * reading and iteration easier. For production usage, separate modules, proper persistence,
 * snapshotting, and robust networking are required.
 */

import { EventEmitter } from "events"

/* ---------- Types ---------- */

enum Role {
  Follower = "Follower",
  Candidate = "Candidate",
  Leader = "Leader",
}

type Term = number

type NodeId = string

interface LogEntry<T = any> {
  term: Term
  index: number // 1-based index for simplicity
  command: T
}

interface PersistentState<T = any> {
  currentTerm: Term
  votedFor: NodeId | null
  log: LogEntry<T>[] // log[0] is a dummy entry (index 0) to simplify indexing
}

interface VolatileState {
  commitIndex: number
  lastApplied: number
}

// For leaders
interface LeaderVolatile {
  nextIndex: Map<NodeId, number>
  matchIndex: Map<NodeId, number>
}

/* ---------- RPCs ---------- */

interface RequestVoteArgs {
  term: Term
  candidateId: NodeId
  lastLogIndex: number
  lastLogTerm: Term
}

interface RequestVoteReply {
  term: Term
  voteGranted: boolean
}

interface AppendEntriesArgs<T = any> {
  term: Term
  leaderId: NodeId
  prevLogIndex: number
  prevLogTerm: Term
  entries: LogEntry<T>[] // empty for heartbeat
  leaderCommit: number
}

interface AppendEntriesReply {
  term: Term
  success: boolean
  conflictIndex?: number // used for optimization (fast retry)
}

/* ---------- Network abstraction ---------- */

// A minimal async transport interface so we can swap real network or in-memory sim
interface Transport<T = any> {
  sendRequestVote(
    target: NodeId,
    args: RequestVoteArgs,
  ): Promise<RequestVoteReply>
  sendAppendEntries(
    target: NodeId,
    args: AppendEntriesArgs<T>,
  ): Promise<AppendEntriesReply>
}

/* ---------- Raft Node ---------- */

class RaftNode<T = any> extends EventEmitter {
  id: NodeId
  peers: NodeId[] // other node ids
  transport: Transport<T>

  // persistent
  state: PersistentState<T>

  // volatile
  volatile: VolatileState
  leaderState?: LeaderVolatile

  role: Role = Role.Follower
  leaderId: NodeId | null = null

  // timers
  electionTimeout: NodeJS.Timeout | null = null
  heartbeatInterval: NodeJS.Timeout | null = null

  // config
  electionTimeoutMin = 150 // ms
  electionTimeoutMax = 300 // ms
  heartbeatIntervalMs = 50 // ms

  // hooks for persisting state (can be overridden)
  async persistState() {
    // default does nothing; override to persist to disk/db
    return
  }

  constructor(
    id: NodeId,
    peers: NodeId[],
    transport: Transport<T>,
    persisted?: Partial<PersistentState<T>>,
  ) {
    super()
    this.id = id
    this.peers = peers.filter((p) => p !== id)
    this.transport = transport

    // initialize persistent state with log[0] dummy entry so first real entry is index 1
    this.state = {
      currentTerm: persisted?.currentTerm ?? 0,
      votedFor: persisted?.votedFor ?? null,
      log: persisted?.log ?? [{ term: 0, index: 0, command: null as any }],
    }

    this.volatile = { commitIndex: 0, lastApplied: 0 }

    // start election timer
    this.resetElectionTimeout()
  }

  /* ---------- utilities ---------- */
  private randomElectionTimeout() {
    return (
      this.electionTimeoutMin +
      Math.floor(
        Math.random() * (this.electionTimeoutMax - this.electionTimeoutMin),
      )
    )
  }

  private lastLogIndex() {
    return this.state.log[this.state.log.length - 1].index
  }

  private lastLogTerm() {
    return this.state.log[this.state.log.length - 1].term
  }

  private become(role: Role) {
    if (this.role === role) return
    this.role = role
    this.emit("roleChange", role)

    if (role === Role.Leader) {
      // initialize leader volatile state
      const nextIndex = new Map<NodeId, number>()
      const matchIndex = new Map<NodeId, number>()
      const next = this.lastLogIndex() + 1
      for (const p of this.peers) {
        nextIndex.set(p, next)
        matchIndex.set(p, 0)
      }
      this.leaderState = { nextIndex, matchIndex }

      // start heartbeats
      this.startHeartbeat()
    } else {
      this.leaderState = undefined
      this.stopHeartbeat()
    }
  }

  /* ---------- timers ---------- */
  private resetElectionTimeout() {
    if (this.electionTimeout) clearTimeout(this.electionTimeout)
    const timeout = this.randomElectionTimeout()
    this.electionTimeout = setTimeout(() => this.startElection(), timeout)
  }

  private clearElectionTimeout() {
    if (this.electionTimeout) {
      clearTimeout(this.electionTimeout)
      this.electionTimeout = null
    }
  }

  private startHeartbeat() {
    this.stopHeartbeat()
    this.heartbeatInterval = setInterval(
      () => this.sendHeartbeats(),
      this.heartbeatIntervalMs,
    )
  }
  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  /* ---------- RPC handlers (incoming) ---------- */
  async handleRequestVote(args: RequestVoteArgs): Promise<RequestVoteReply> {
    if (args.term > this.state.currentTerm) {
      this.state.currentTerm = args.term
      this.state.votedFor = null
      await this.persistState()
      this.become(Role.Follower)
    }

    let voteGranted = false
    if (args.term === this.state.currentTerm) {
      const votedFor = this.state.votedFor
      const upToDate =
        args.lastLogTerm > this.lastLogTerm() ||
        (args.lastLogTerm === this.lastLogTerm() &&
          args.lastLogIndex >= this.lastLogIndex())

      if ((votedFor === null || votedFor === args.candidateId) && upToDate) {
        this.state.votedFor = args.candidateId
        await this.persistState()
        voteGranted = true
        this.resetElectionTimeout() // heard from a candidate -> reset
      }
    }

    return { term: this.state.currentTerm, voteGranted }
  }

  async handleAppendEntries(
    args: AppendEntriesArgs<T>,
  ): Promise<AppendEntriesReply> {
    if (args.term > this.state.currentTerm) {
      this.state.currentTerm = args.term
      this.state.votedFor = null
      await this.persistState()
      this.become(Role.Follower)
    }

    // Reply false if term < currentTerm
    if (args.term < this.state.currentTerm) {
      return { term: this.state.currentTerm, success: false }
    }

    // We are a follower and leader is known
    this.leaderId = args.leaderId
    this.resetElectionTimeout()

    // Check if log contains an entry at prevLogIndex with term == prevLogTerm
    const prevIdx = args.prevLogIndex
    if (prevIdx > this.lastLogIndex()) {
      return {
        term: this.state.currentTerm,
        success: false,
        conflictIndex: this.lastLogIndex() + 1,
      }
    }

    const prevTerm = prevIdx >= 0 ? (this.state.log[prevIdx]?.term ?? -1) : -1
    if (prevIdx >= 0 && prevTerm !== args.prevLogTerm) {
      // conflict: find first index with that term
      let conflictIndex = prevIdx
      while (
        conflictIndex > 0 &&
        this.state.log[conflictIndex].term === prevTerm
      )
        conflictIndex--
      return {
        term: this.state.currentTerm,
        success: false,
        conflictIndex: conflictIndex + 1,
      }
    }

    // Append any new entries not already in the log
    let idx = prevIdx + 1
    let i = 0
    while (i < args.entries.length) {
      const entry = args.entries[i]
      if (this.state.log[idx] && this.state.log[idx].term !== entry.term) {
        // delete conflicting entry and all that follow it
        this.state.log = this.state.log.slice(0, idx)
      }
      if (!this.state.log[idx]) {
        this.state.log[idx] = entry
      }
      idx++
      i++
    }

    // update commit index
    if (args.leaderCommit > this.volatile.commitIndex) {
      this.volatile.commitIndex = Math.min(
        args.leaderCommit,
        this.lastLogIndex(),
      )
      this.applyEntries()
    }

    return { term: this.state.currentTerm, success: true }
  }

  /* ---------- client-facing API ---------- */
  async submitCommand(command: T): Promise<number> {
    // only leader accepts client commands in Raft
    if (this.role !== Role.Leader) throw new Error("Not leader")

    const entry: LogEntry<T> = {
      term: this.state.currentTerm,
      index: this.lastLogIndex() + 1,
      command,
    }
    this.state.log.push(entry)
    await this.persistState()

    // start replication to followers
    this.replicateToAll()

    return entry.index
  }

  /* ---------- leader election ---------- */
  private async startElection() {
    this.become(Role.Candidate)
    this.state.currentTerm += 1
    this.state.votedFor = this.id
    await this.persistState()

    const termStarted = this.state.currentTerm
    const votes = new Set<NodeId>([this.id])
    this.resetElectionTimeout() // if election fails we'll start another

    const args: RequestVoteArgs = {
      term: termStarted,
      candidateId: this.id,
      lastLogIndex: this.lastLogIndex(),
      lastLogTerm: this.lastLogTerm(),
    }

    // send RequestVote RPCs in parallel
    await Promise.all(
      this.peers.map(async (peer) => {
        try {
          const reply = await this.transport.sendRequestVote(peer, args)
          if (this.state.currentTerm !== termStarted) return // stale
          if (reply.term > this.state.currentTerm) {
            this.state.currentTerm = reply.term
            this.state.votedFor = null
            await this.persistState()
            this.become(Role.Follower)
            return
          }
          if (reply.voteGranted) {
            votes.add(peer)
            // majority?
            if (votes.size > Math.floor((this.peers.length + 1) / 2)) {
              this.become(Role.Leader)
              this.leaderId = this.id
              // on election: send initial empty AppendEntries to assert leadership
              this.replicateToAll()
            }
          }
        } catch (e) {
          // network error; ignore
        }
      }),
    )
  }

  /* ---------- replication ---------- */
  private async replicateToAll() {
    if (this.role !== Role.Leader || !this.leaderState) return
    for (const peer of this.peers) this.replicateOne(peer).catch(() => {})
  }

  private async replicateOne(peer: NodeId) {
    if (this.role !== Role.Leader || !this.leaderState) return
    const nextIndex =
      this.leaderState.nextIndex.get(peer) ?? this.lastLogIndex() + 1
    const prevLogIndex = nextIndex - 1
    const prevLogTerm = this.state.log[prevLogIndex]?.term ?? 0
    const entries = this.state.log.slice(nextIndex)

    const args: AppendEntriesArgs<T> = {
      term: this.state.currentTerm,
      leaderId: this.id,
      prevLogIndex,
      prevLogTerm,
      entries,
      leaderCommit: this.volatile.commitIndex,
    }

    try {
      const reply = await this.transport.sendAppendEntries(peer, args)
      if (reply.term > this.state.currentTerm) {
        this.state.currentTerm = reply.term
        this.state.votedFor = null
        await this.persistState()
        this.become(Role.Follower)
        return
      }

      if (reply.success) {
        const matchIdx = prevLogIndex + entries.length
        this.leaderState.matchIndex.set(peer, matchIdx)
        this.leaderState.nextIndex.set(peer, matchIdx + 1)

        // update commit index: find N such that N>commitIndex, a majority have matchIndex >= N and log[N].term === currentTerm
        for (let N = this.lastLogIndex(); N > this.volatile.commitIndex; N--) {
          const termAtN = this.state.log[N]?.term ?? -1
          if (termAtN !== this.state.currentTerm) continue
          let count = 1 // leader
          for (const p of this.peers) {
            if ((this.leaderState.matchIndex.get(p) ?? 0) >= N) count++
          }
          if (count > Math.floor((this.peers.length + 1) / 2)) {
            this.volatile.commitIndex = N
            this.applyEntries()
            break
          }
        }
      } else {
        // reply failed: back off nextIndex using conflictIndex if provided
        if (reply.conflictIndex) {
          this.leaderState.nextIndex.set(peer, reply.conflictIndex)
        } else {
          const ni = (this.leaderState.nextIndex.get(peer) ?? 1) - 1
          this.leaderState.nextIndex.set(peer, Math.max(1, ni))
        }
        // retry
        setTimeout(() => this.replicateOne(peer), 10)
      }
    } catch (e) {
      // network error, retry later
      setTimeout(() => this.replicateOne(peer), 50)
    }
  }

  private async sendHeartbeats() {
    if (this.role !== Role.Leader) return
    // send AppendEntries with empty entries to maintain authority
    for (const peer of this.peers) {
      const nextIndex = this.leaderState!.nextIndex.get(peer) ?? 1
      const prevLogIndex = nextIndex - 1
      const prevLogTerm = this.state.log[prevLogIndex]?.term ?? 0
      const args: AppendEntriesArgs<T> = {
        term: this.state.currentTerm,
        leaderId: this.id,
        prevLogIndex,
        prevLogTerm,
        entries: [],
        leaderCommit: this.volatile.commitIndex,
      }
      this.transport
        .sendAppendEntries(peer, args)
        .then((reply) => {
          if (!reply) return
          if (reply.term > this.state.currentTerm) {
            this.state.currentTerm = reply.term
            this.state.votedFor = null
            this.persistState()
            this.become(Role.Follower)
          }
        })
        .catch(() => {})
    }
  }

  /* ---------- applying entries to state machine ---------- */
  private applyEntries() {
    while (this.volatile.lastApplied < this.volatile.commitIndex) {
      this.volatile.lastApplied += 1
      const entry = this.state.log[this.volatile.lastApplied]
      // emit an event for the application of this entry
      this.emit("apply", entry.command, this.volatile.lastApplied)
    }
  }

  /* ---------- shutdown ---------- */
  stop() {
    this.clearElectionTimeout()
    this.stopHeartbeat()
  }
}

/* ---------- In-memory transport simulator ---------- */

class InMemoryTransport<T = any> implements Transport<T> {
  nodes: Map<NodeId, RaftNode<T>> = new Map()
  unreliable = false
  minDelay = 2
  maxDelay = 20

  register(node: RaftNode<T>) {
    this.nodes.set(node.id, node)
  }

  async sendRequestVote(
    target: NodeId,
    args: RequestVoteArgs,
  ): Promise<RequestVoteReply> {
    const node = this.nodes.get(target)
    if (!node) throw new Error("target not found")
    await this.simNetworkDelay()
    return await node.handleRequestVote(args)
  }

  async sendAppendEntries(
    target: NodeId,
    args: AppendEntriesArgs<T>,
  ): Promise<AppendEntriesReply> {
    const node = this.nodes.get(target)
    if (!node) throw new Error("target not found")
    await this.simNetworkDelay()
    return await node.handleAppendEntries(args)
  }

  private async simNetworkDelay() {
    // simulate delay and unreliability
    const d =
      this.minDelay +
      Math.floor(Math.random() * (this.maxDelay - this.minDelay + 1))
    await new Promise((res) => setTimeout(res, d))
    if (this.unreliable && Math.random() < 0.05)
      throw new Error("network failure")
  }
}

/* ---------- Example usage / simulation ---------- */

;(async () => {
  // set up 3-node cluster
  const ids = ["A", "B", "C"]
  const transport = new InMemoryTransport<string>()

  const nodes = ids.map((id) => {
    const node = new RaftNode<string>(id, ids, transport)
    transport.register(node)
    node.on("apply", (cmd, idx) => {
      console.log(`Node ${node.id} applied index=${idx} cmd=`, cmd)
    })
    node.on("roleChange", (role) =>
      console.log(`Node ${node.id} became ${role}`),
    )
    return node
  })

  // wait briefly to elect a leader
  await new Promise((res) => setTimeout(res, 1000))

  // find leader
  const leader = nodes.find((n) => n.role === Role.Leader)
  if (!leader) {
    console.log("No leader elected (try increasing wait)")
    process.exit(1)
  }
  console.log("Leader is", leader.id)

  // submit commands
  try {
    const idx1 = await leader.submitCommand("set x=1")
    console.log("Leader appended command at", idx1)
  } catch (e) {
    console.error("submit failed", e)
  }

  // wait for replication
  await new Promise((res) => setTimeout(res, 500))

  // shutdown
  for (const n of nodes) n.stop()
  process.exit(0)
})()

export { RaftNode, InMemoryTransport, Role, LogEntry }

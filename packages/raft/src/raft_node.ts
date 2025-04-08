import { Request, Response } from "express"
// import { request } from "loony-utils"
// import { ConnectedPeers } from "./node"

interface LogEntry {
  term: number
  command: string
}

const HEARTBEAT_INTERVAL = 1500
const ELECTION_TIMER = 3000

export class RaftNode {
  id: string
  peers: string[]
  // peers: ConnectedPeers | undefined

  state: "follower" | "candidate" | "leader"
  currentTerm: number
  votedFor: string | null
  log: LogEntry[]
  commitIndex: number
  lastApplied: number
  leaderId: string | null
  electionTimeout: number
  heartbeatInterval: number
  electionTimer: NodeJS.Timeout | null

  constructor(id: string, peers: string[]) {
    this.id = id
    this.peers = peers
    this.state = "follower"
    this.currentTerm = 0
    this.votedFor = null
    this.log = []
    this.commitIndex = 0
    this.lastApplied = 0
    this.leaderId = null
    this.electionTimeout = this.resetElectionTimeout()
    this.heartbeatInterval = 1500
    this.electionTimer = null

    this.startElectionTimer()
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
    this.state = "candidate"
    this.currentTerm++
    this.votedFor = this.id
    let votes = 1
    console.log(
      `Node ${this.id} is starting an election for term ${this.currentTerm}`,
    )

    await Promise.all(
      this.peers.map(async (peer) => {
        try {
          const res = await fetch(`${peer}/vote`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              term: this.currentTerm,
              candidateId: this.id,
            }),
          }).then((res) => res.json())

          if (res.voteGranted) votes++
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error("Vote request failed", error.message)
        }
      }),
    )
    console.log(votes, "votes")
    if (votes > Math.floor((this.peers.length + 1) / 2)) {
      this.becomeLeader()
    } else {
      this.startElectionTimer()
    }
  }

  becomeLeader(): void {
    this.state = "leader"
    this.leaderId = this.id
    console.log(`Node ${this.id} is now the leader`)
    this.sendHeartbeats()
  }

  async sendHeartbeats(): Promise<void> {
    if (this.state !== "leader") return

    setInterval(async () => {
      await Promise.all(
        this.peers.map(async (peer) => {
          try {
            await fetch(`${peer}/heartbeat`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                term: this.currentTerm,
                leaderId: this.id,
              }),
            }).then((res) => res.json())
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            console.error("Heartbeat failed", error.message)
          }
        }),
      )
    }, this.heartbeatInterval)
  }

  handleVoteRequest(req: Request, res: Response): void {
    const { term, candidateId } = req.body
    if (term > this.currentTerm) {
      this.currentTerm = term
      this.votedFor = candidateId
      this.startElectionTimer()
      res.json({ voteGranted: true })
    } else {
      res.json({ voteGranted: false })
    }
  }

  handleHeartbeat(req: Request, res: Response): void {
    const { term, leaderId } = req.body
    if (term >= this.currentTerm) {
      this.currentTerm = term
      this.leaderId = leaderId
      this.state = "follower"
      this.startElectionTimer()
    }
    if (term / 10 === 0) {
      console.clear()
    }
    console.log(req.body)
    res.json({ success: true })
  }
}

// // Setting up Express server
// const app = express()
// app.use(express.json())

// const node = new RaftNode("node1", [
//   "http://localhost:5001",
//   "http://localhost:5002",
// ])

// app.post("/vote", (req: Request, res: Response) =>
//   node.handleVoteRequest(req, res),
// )
// app.post("/heartbeat", (req: Request, res: Response) =>
//   node.handleHeartbeat(req, res),
// )

// app.listen(5000, () => console.log("Raft Node running on port 5000"))

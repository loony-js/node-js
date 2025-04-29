/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import EventEmitter from "node:events"
import { Tick } from "loony-timer"
// import { modification, Changeable } from "loony-utils/src/modification"
import { Entry, Log } from "./log"
import { Message } from "./utils"

enum RAFT_STATE {
  STOPPED = 0,
  LEADER = 1,
  CANDIDATE = 2,
  FOLLOWER = 3,
  CHILD = 4,
}

const RAFT_STATES = [
  RAFT_STATE.STOPPED,
  RAFT_STATE.LEADER,
  RAFT_STATE.CANDIDATE,
  RAFT_STATE.FOLLOWER,
  RAFT_STATE.CHILD,
]

type Packet = {
  state: number
  term: number
  address: number
  type: string
  leader: number | null
  last?: any // Mark as optional since it's conditionally added
  data?: any // Also optional
}

// const change = modification()
/**
 * A nope function for when people don't want message acknowledgements. Because
 * they don't care about CAP.
 *
 * @private
 */
function nope() {}

export class Raft extends EventEmitter {
  beat: number
  election: {
    min: number
    max: number
  } | null
  votes: {
    for: number | null
    granted: number
  }
  threshold: number
  address: number
  latency: number
  nodes: Raft[]
  leader: number | null
  term: number
  state: RAFT_STATE
  states = RAFT_STATES
  timers: Tick
  log: null
  db: Log

  //   change: <T extends Changeable>(this: any, changed: Partial<T>) => T

  constructor(
    address: number,
    options: {
      threshold?: number
      address: number
      state?: RAFT_STATE
      election: {
        min: number
        max: number
      }
      heartbeat: number
    },
  ) {
    super()

    if ("object" === typeof address) options = address
    else if (!options.address) options.address = address

    this.election = {
      min: options.election.min || 150,
      max: options.election.max || 300,
    }

    this.beat = options.heartbeat || 50

    this.votes = {
      for: null, // Who did we vote for in this current term.
      granted: 0, // How many votes we're granted to us.
    }

    this.threshold = options.threshold || 0.8
    this.address = options.address
    this.timers = new Tick()
    this.db = new Log()
    this.log = null
    // this.change = change
    // raft.write = raft.write || options.write || null
    this.latency = 0
    this.nodes = []

    //
    // Raft §5.2:
    //
    // When a server starts, it's always started as Follower and it will remain in
    // this state until receive a message from a Leader or Candidate.
    //

    // Our current state.
    this.state = options.state ? options.state : RAFT_STATE.FOLLOWER

    // Leader in our cluster.
    this.leader = null

    // Our current term.
    this.term = 0

    this._initialize(options)
  }

  _initialize(options: any) {
    this.emit(Message.CANDIDATE)
  }
}

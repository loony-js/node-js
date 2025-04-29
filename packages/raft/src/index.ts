/* eslint-disable @typescript-eslint/no-explicit-any */
// const debug = require("diagnostics")("raft")
// const argv = require("argh").argv
// const LifeRaft = require("../")
// const net = require("net")
import { Raft } from "./raftNode-v3"
import { Message } from "./utils"
// import { Message } from "./utils"

//
// Create a custom Raft instance which uses a plain TCP server and client to
// communicate back and forth.
//
class TCPRaft extends Raft {
  constructor(port: any, options: any) {
    super(port, options)
    this.init()
  }

  init() {
    this.on(Message.CANDIDATE, () => {
      console.log(Message.CANDIDATE)
    })
  }
}

//
// We're going to start with a static list of servers. A minimum cluster size is
// 4 as that only requires majority of 3 servers to have a new leader to be
// assigned. This allows the failure of one single server.
//
const ports = [8081, 8082, 8083, 8084, 8085, 8086]

//
// The port number of this Node process.
//
const port = process.env.PORT ? +process.env.PORT : ports[0]

//
// Now that we have all our variables we can safely start up our server with our
// assigned port number.
//
const raft = new TCPRaft(port, {
  election: {
    min: 2000,
    max: 5000,
  },
  heartbeat: 1000,
  address: port,
})

raft.on(Message.CANDIDATE, () => {
  console.log("----------------------------------")
  console.log("I am starting as candidate")
  console.log("----------------------------------")
})
setTimeout(() => {}, 3000)

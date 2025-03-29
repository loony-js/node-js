import dotenv from "dotenv"
import { exit } from "process"
import fs from "fs"
import internal from "stream"

dotenv.config()
const PORT = process.env.PORT
const WS_CLIENTS: Set<internal.Duplex> = new Set()
const PEERS_FILE_PATH = process.env.PEERS_FILE_PATH
let PEERS: number[] = []

if (!PORT) {
  console.log("PORT not specified")
  exit()
}

// Close app in PORT is not provided.
;(async () => {
  if (!PEERS_FILE_PATH) {
    exit()
  }
  try {
    const peers = fs.readFileSync(PEERS_FILE_PATH, "utf-8")
    if (peers) {
      const allPeers = JSON.parse(peers)
      PEERS = allPeers[PORT]
    }
  } catch (error) {
    console.log(error)
  }
})()

export { WS_CLIENTS, PEERS, PORT }

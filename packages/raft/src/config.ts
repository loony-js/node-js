import dotenv from "dotenv"
import { GRPC_PORTS, HTTP_PORTS } from "./config.json"

dotenv.config()

let HTTP_PORT: any = process.env.PORT || process.env.HTTP_PORT
let PEER_ADDRESS: any = process.env.PEER || process.env.PEER_ADDRESS

if (!HTTP_PORT || !PEER_ADDRESS) {
  console.log(
    `Failed to start node. PORT=2000 PEER_ADDRESS=50050  node ./dist/index.js`,
  )
  process.exit()
}

HTTP_PORT = parseInt(HTTP_PORT)
PEER_ADDRESS = parseInt(PEER_ADDRESS)

const getGrpcConfig = () => {
  const GRPC_PORT = parseInt(PEER_ADDRESS)
  return {
    GRPC_PORT,
    GRPC_PEERS: GRPC_PORTS.filter((p) => p !== GRPC_PORT),
  }
}

const getHttpConfig = () => {
  const HTTP_PEERS = HTTP_PORTS.filter((p) => p !== HTTP_PORT)
  return { HTTP_PORT, HTTP_PEERS }
}

export default {
  HTTP_PORT,
  PEER_ADDRESS,
  getGrpcConfig,
  getHttpConfig,
}

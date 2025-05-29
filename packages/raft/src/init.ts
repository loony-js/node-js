import config from "./config.json"

export const getGrpcConfig = () => {
  const GRPC_PORTS_CONFIG: number[] = config.GRPC_PORTS
  const GRPC_PORT_STRING: string | undefined = process.env.GRPC_PORT
  if (!GRPC_PORT_STRING) {
    console.log(`GRPC_PORT=50050 node ./dist/index.js`)
    process.exit()
  }
  const GRPC_PORT = parseInt(GRPC_PORT_STRING)
  return {
    GRPC_PORT,
    GRPC_PEERS: GRPC_PORTS_CONFIG.filter((p) => p !== GRPC_PORT),
  }
}

export const getHttpConfig = () => {
  const HTTP_PORTS_CONFIG: number[] = config.HTTP_PORTS
  const HTTP_PORT_STRING: string | undefined = process.env.PORT
  if (!HTTP_PORT_STRING) {
    console.log(`HTTP_PORT=2000 node ./dist/index.js`)
    process.exit()
  }
  const HTTP_PORT = parseInt(HTTP_PORT_STRING)
  const HTTP_PEERS = HTTP_PORTS_CONFIG.filter((p) => p !== HTTP_PORT)
  return { HTTP_PORT, HTTP_PEERS }
}

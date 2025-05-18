// import config from "./config.json"

// const GRPC_PORTS_CONFIG: number[] = config.GRPC_PORTS
// const HTTP_PORTS_CONFIG: number[] = config.HTTP_PORTS

const HTTP_PORT_STRING: string | undefined = process.env.PORT

if (!HTTP_PORT_STRING) {
  console.log(`HTTP_PORT=2000 node ./dist/index.js`)
  process.exit()
}

// const GRPC_PORT = parseInt(GRPC_PORT_STRING)
const HTTP_PORT = parseInt(HTTP_PORT_STRING)
// const GRPC_PORTS: number[] = GRPC_PORTS_CONFIG.filter((p) => p !== GRPC_PORT)

export { HTTP_PORT }

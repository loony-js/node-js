/* eslint-disable @typescript-eslint/no-explicit-any */
import { RaftNode } from "./raftNode-v1"
import config from "./config.json"
import { server as grpcServer, raftProto } from "./grpc.server"
import * as grpc from "@grpc/grpc-js"

const peers = []
const nodePorts: Record<string, number[]> = config.ports

function nodeAlive(
  call: grpc.ServerUnaryCall<any, any>,
  callback: grpc.sendUnaryData<any>,
) {
  // console.log(`From client: ${call.request.title}`)
  callback(null, { alive: true })
}

;(async () => {
  const thisPort: string | undefined = process.env.PORT
  if (!thisPort) {
    process.exit()
  }
  const ports: number[] = nodePorts[thisPort]
  const PORT = parseInt(thisPort)

  class RaftHandler extends RaftNode {}

  const node = new RaftHandler(PORT, ports)

  const url = `0.0.0.0:${PORT}`

  grpcServer.addService(raftProto.RaftService.service, {
    NodeAlive: nodeAlive,
    AddPeer: node.addPeer,
  })

  grpcServer.bindAsync(url, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`gRPC server running at ${url}`)
    // server.start()
  })

  for (let index = 0; index < ports.length; index++) {
    const currentPort = ports[index]
    peers.push(
      new raftProto.RaftService(
        `localhost:${currentPort}`,
        grpc.credentials.createInsecure(),
      ),
    )
  }
})()

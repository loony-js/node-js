/* eslint-disable @typescript-eslint/no-explicit-any */
import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import EventEmitter from "node:events"
import path from "path"

class GrpcHandler extends EventEmitter {
  server: grpc.Server
  grpcObject: grpc.GrpcObject
  raft: any
  clients: any[]

  constructor() {
    super()
    const packageDefinition = protoLoader.loadSync(
      path.resolve(__dirname, "protos/raft.proto"),
    )
    this.grpcObject = grpc.loadPackageDefinition(
      packageDefinition,
    ) as grpc.GrpcObject
    this.raft = this.grpcObject.raft
    this.server = new grpc.Server()
    this.clients = []
  }

  start(port: number) {
    this.server.bindAsync(
      `0.0.0.0:${port}`,
      grpc.ServerCredentials.createInsecure(),
      () => {
        console.log(`gRPC server running at http://0.0.0.0:${port}`)
      },
    )
  }

  addService(services: grpc.UntypedServiceImplementation) {
    this.server.addService(this.raft.RaftService.service, services)
  }

  addClient(port: number) {
    this.clients.push(
      new this.raft.RaftService(
        `localhost:${port}`,
        grpc.credentials.createInsecure(),
      ),
    )
    console.log(`Client Id: ${port} added as peer.`)
  }

  callService(requestName: string, data: any) {
    switch (requestName) {
      case "REQUEST_VOTE":
        break
      case "APPEND_ENTRIES":
        for (let index = 0; index < this.clients.length; index++) {
          const client = this.clients[index]
          client.AppendEntries(
            data,
            (err: grpc.ServiceError | null, response: any) => {
              if (err) {
                console.error("AppendEntries failed:", err)
              } else {
                console.log("AppendEntries response:", response)
              }
            },
          )
        }
        break

      default:
        break
    }
  }
}

export { GrpcHandler }
export default GrpcHandler

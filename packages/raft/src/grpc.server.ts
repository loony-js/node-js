/* eslint-disable @typescript-eslint/no-explicit-any */
import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import path from "path"

const packageDefinition = protoLoader.loadSync(
  path.resolve(__dirname, "protos/raft.proto"),
)
const grpcPackageDef = grpc.loadPackageDefinition(packageDefinition) as any
const raftProto = grpcPackageDef.raft

function sayHello(
  call: grpc.ServerUnaryCall<any, any>,
  callback: grpc.sendUnaryData<any>,
) {
  // console.log(`From client: ${call.request.title}`)
  callback(null, { title: `Hello, from raft server` })
}

const server = new grpc.Server()
server.addService(raftProto.RaftService.service, { SayHello: sayHello })
// server.bindAsync(
//   "0.0.0.0:50051",
//   grpc.ServerCredentials.createInsecure(),
//   () => {
//     console.log("gRPC server running at http://0.0.0.0:50051")
//     // server.start()
//   },
// )

export { server }

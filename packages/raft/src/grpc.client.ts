/* eslint-disable @typescript-eslint/no-explicit-any */
import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import path from "path"

const packageDefinition = protoLoader.loadSync(
  path.resolve(__dirname, "protos/raft.proto"),
)
const grpcObj = grpc.loadPackageDefinition(packageDefinition) as any
const raftPackage = grpcObj.raft

const client = new raftPackage.RaftService(
  "localhost:50051",
  grpc.credentials.createInsecure(),
)

export { client }

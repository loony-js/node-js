/* eslint-disable @typescript-eslint/no-explicit-any */
import { RaftNode } from "./raftNodeUsingGrpc"
import { GrpcHandler } from "./grpc.server"

import { getGrpcConfig } from "./init"

const { GRPC_PORT, GRPC_PEERS } = getGrpcConfig()

const node = new RaftNode(GRPC_PORT)
const grpcServer = new GrpcHandler()
grpcServer.setRaftNode(node)
grpcServer.addServices()

node.setGrpc(grpcServer)
grpcServer.addClients(GRPC_PEERS)

node.start()
grpcServer.start(GRPC_PORT)

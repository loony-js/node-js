// package: raft
// file: raft.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as raft_pb from "./raft_pb";

interface IRaftServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    isAlive: IRaftServiceService_IIsAlive;
    heartbeat: IRaftServiceService_IHeartbeat;
    voteRequest: IRaftServiceService_IVoteRequest;
    appendEntries: IRaftServiceService_IAppendEntries;
}

interface IRaftServiceService_IIsAlive extends grpc.MethodDefinition<raft_pb.AliveReq, raft_pb.AliveRes> {
    path: "/raft.RaftService/IsAlive";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<raft_pb.AliveReq>;
    requestDeserialize: grpc.deserialize<raft_pb.AliveReq>;
    responseSerialize: grpc.serialize<raft_pb.AliveRes>;
    responseDeserialize: grpc.deserialize<raft_pb.AliveRes>;
}
interface IRaftServiceService_IHeartbeat extends grpc.MethodDefinition<raft_pb.AppendEntriesReq, raft_pb.AppendEntriesRes> {
    path: "/raft.RaftService/Heartbeat";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<raft_pb.AppendEntriesReq>;
    requestDeserialize: grpc.deserialize<raft_pb.AppendEntriesReq>;
    responseSerialize: grpc.serialize<raft_pb.AppendEntriesRes>;
    responseDeserialize: grpc.deserialize<raft_pb.AppendEntriesRes>;
}
interface IRaftServiceService_IVoteRequest extends grpc.MethodDefinition<raft_pb.VoteReq, raft_pb.VoteRes> {
    path: "/raft.RaftService/VoteRequest";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<raft_pb.VoteReq>;
    requestDeserialize: grpc.deserialize<raft_pb.VoteReq>;
    responseSerialize: grpc.serialize<raft_pb.VoteRes>;
    responseDeserialize: grpc.deserialize<raft_pb.VoteRes>;
}
interface IRaftServiceService_IAppendEntries extends grpc.MethodDefinition<raft_pb.AppendEntriesReq, raft_pb.AppendEntriesRes> {
    path: "/raft.RaftService/AppendEntries";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<raft_pb.AppendEntriesReq>;
    requestDeserialize: grpc.deserialize<raft_pb.AppendEntriesReq>;
    responseSerialize: grpc.serialize<raft_pb.AppendEntriesRes>;
    responseDeserialize: grpc.deserialize<raft_pb.AppendEntriesRes>;
}

export const RaftServiceService: IRaftServiceService;

export interface IRaftServiceServer extends grpc.UntypedServiceImplementation {
    isAlive: grpc.handleUnaryCall<raft_pb.AliveReq, raft_pb.AliveRes>;
    heartbeat: grpc.handleUnaryCall<raft_pb.AppendEntriesReq, raft_pb.AppendEntriesRes>;
    voteRequest: grpc.handleUnaryCall<raft_pb.VoteReq, raft_pb.VoteRes>;
    appendEntries: grpc.handleUnaryCall<raft_pb.AppendEntriesReq, raft_pb.AppendEntriesRes>;
}

export interface IRaftServiceClient {
    isAlive(request: raft_pb.AliveReq, callback: (error: grpc.ServiceError | null, response: raft_pb.AliveRes) => void): grpc.ClientUnaryCall;
    isAlive(request: raft_pb.AliveReq, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: raft_pb.AliveRes) => void): grpc.ClientUnaryCall;
    isAlive(request: raft_pb.AliveReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: raft_pb.AliveRes) => void): grpc.ClientUnaryCall;
    heartbeat(request: raft_pb.AppendEntriesReq, callback: (error: grpc.ServiceError | null, response: raft_pb.AppendEntriesRes) => void): grpc.ClientUnaryCall;
    heartbeat(request: raft_pb.AppendEntriesReq, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: raft_pb.AppendEntriesRes) => void): grpc.ClientUnaryCall;
    heartbeat(request: raft_pb.AppendEntriesReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: raft_pb.AppendEntriesRes) => void): grpc.ClientUnaryCall;
    voteRequest(request: raft_pb.VoteReq, callback: (error: grpc.ServiceError | null, response: raft_pb.VoteRes) => void): grpc.ClientUnaryCall;
    voteRequest(request: raft_pb.VoteReq, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: raft_pb.VoteRes) => void): grpc.ClientUnaryCall;
    voteRequest(request: raft_pb.VoteReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: raft_pb.VoteRes) => void): grpc.ClientUnaryCall;
    appendEntries(request: raft_pb.AppendEntriesReq, callback: (error: grpc.ServiceError | null, response: raft_pb.AppendEntriesRes) => void): grpc.ClientUnaryCall;
    appendEntries(request: raft_pb.AppendEntriesReq, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: raft_pb.AppendEntriesRes) => void): grpc.ClientUnaryCall;
    appendEntries(request: raft_pb.AppendEntriesReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: raft_pb.AppendEntriesRes) => void): grpc.ClientUnaryCall;
}

export class RaftServiceClient extends grpc.Client implements IRaftServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public isAlive(request: raft_pb.AliveReq, callback: (error: grpc.ServiceError | null, response: raft_pb.AliveRes) => void): grpc.ClientUnaryCall;
    public isAlive(request: raft_pb.AliveReq, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: raft_pb.AliveRes) => void): grpc.ClientUnaryCall;
    public isAlive(request: raft_pb.AliveReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: raft_pb.AliveRes) => void): grpc.ClientUnaryCall;
    public heartbeat(request: raft_pb.AppendEntriesReq, callback: (error: grpc.ServiceError | null, response: raft_pb.AppendEntriesRes) => void): grpc.ClientUnaryCall;
    public heartbeat(request: raft_pb.AppendEntriesReq, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: raft_pb.AppendEntriesRes) => void): grpc.ClientUnaryCall;
    public heartbeat(request: raft_pb.AppendEntriesReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: raft_pb.AppendEntriesRes) => void): grpc.ClientUnaryCall;
    public voteRequest(request: raft_pb.VoteReq, callback: (error: grpc.ServiceError | null, response: raft_pb.VoteRes) => void): grpc.ClientUnaryCall;
    public voteRequest(request: raft_pb.VoteReq, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: raft_pb.VoteRes) => void): grpc.ClientUnaryCall;
    public voteRequest(request: raft_pb.VoteReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: raft_pb.VoteRes) => void): grpc.ClientUnaryCall;
    public appendEntries(request: raft_pb.AppendEntriesReq, callback: (error: grpc.ServiceError | null, response: raft_pb.AppendEntriesRes) => void): grpc.ClientUnaryCall;
    public appendEntries(request: raft_pb.AppendEntriesReq, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: raft_pb.AppendEntriesRes) => void): grpc.ClientUnaryCall;
    public appendEntries(request: raft_pb.AppendEntriesReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: raft_pb.AppendEntriesRes) => void): grpc.ClientUnaryCall;
}

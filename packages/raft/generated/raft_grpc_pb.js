// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var raft_pb = require('./raft_pb.js');

function serialize_raft_AliveReq(arg) {
  if (!(arg instanceof raft_pb.AliveReq)) {
    throw new Error('Expected argument of type raft.AliveReq');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_raft_AliveReq(buffer_arg) {
  return raft_pb.AliveReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_raft_AliveRes(arg) {
  if (!(arg instanceof raft_pb.AliveRes)) {
    throw new Error('Expected argument of type raft.AliveRes');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_raft_AliveRes(buffer_arg) {
  return raft_pb.AliveRes.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_raft_AppendEntriesReq(arg) {
  if (!(arg instanceof raft_pb.AppendEntriesReq)) {
    throw new Error('Expected argument of type raft.AppendEntriesReq');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_raft_AppendEntriesReq(buffer_arg) {
  return raft_pb.AppendEntriesReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_raft_AppendEntriesRes(arg) {
  if (!(arg instanceof raft_pb.AppendEntriesRes)) {
    throw new Error('Expected argument of type raft.AppendEntriesRes');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_raft_AppendEntriesRes(buffer_arg) {
  return raft_pb.AppendEntriesRes.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_raft_HeartbeatReq(arg) {
  if (!(arg instanceof raft_pb.HeartbeatReq)) {
    throw new Error('Expected argument of type raft.HeartbeatReq');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_raft_HeartbeatReq(buffer_arg) {
  return raft_pb.HeartbeatReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_raft_HeartbeatRes(arg) {
  if (!(arg instanceof raft_pb.HeartbeatRes)) {
    throw new Error('Expected argument of type raft.HeartbeatRes');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_raft_HeartbeatRes(buffer_arg) {
  return raft_pb.HeartbeatRes.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_raft_VoteReq(arg) {
  if (!(arg instanceof raft_pb.VoteReq)) {
    throw new Error('Expected argument of type raft.VoteReq');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_raft_VoteReq(buffer_arg) {
  return raft_pb.VoteReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_raft_VoteRes(arg) {
  if (!(arg instanceof raft_pb.VoteRes)) {
    throw new Error('Expected argument of type raft.VoteRes');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_raft_VoteRes(buffer_arg) {
  return raft_pb.VoteRes.deserializeBinary(new Uint8Array(buffer_arg));
}


var RaftServiceService = exports.RaftServiceService = {
  isAlive: {
    path: '/raft.RaftService/IsAlive',
    requestStream: false,
    responseStream: false,
    requestType: raft_pb.AliveReq,
    responseType: raft_pb.AliveRes,
    requestSerialize: serialize_raft_AliveReq,
    requestDeserialize: deserialize_raft_AliveReq,
    responseSerialize: serialize_raft_AliveRes,
    responseDeserialize: deserialize_raft_AliveRes,
  },
  heartbeat: {
    path: '/raft.RaftService/Heartbeat',
    requestStream: false,
    responseStream: false,
    requestType: raft_pb.HeartbeatReq,
    responseType: raft_pb.HeartbeatRes,
    requestSerialize: serialize_raft_HeartbeatReq,
    requestDeserialize: deserialize_raft_HeartbeatReq,
    responseSerialize: serialize_raft_HeartbeatRes,
    responseDeserialize: deserialize_raft_HeartbeatRes,
  },
  voteRequest: {
    path: '/raft.RaftService/VoteRequest',
    requestStream: false,
    responseStream: false,
    requestType: raft_pb.VoteReq,
    responseType: raft_pb.VoteRes,
    requestSerialize: serialize_raft_VoteReq,
    requestDeserialize: deserialize_raft_VoteReq,
    responseSerialize: serialize_raft_VoteRes,
    responseDeserialize: deserialize_raft_VoteRes,
  },
  appendEntries: {
    path: '/raft.RaftService/AppendEntries',
    requestStream: false,
    responseStream: false,
    requestType: raft_pb.AppendEntriesReq,
    responseType: raft_pb.AppendEntriesRes,
    requestSerialize: serialize_raft_AppendEntriesReq,
    requestDeserialize: deserialize_raft_AppendEntriesReq,
    responseSerialize: serialize_raft_AppendEntriesRes,
    responseDeserialize: deserialize_raft_AppendEntriesRes,
  },
};

exports.RaftServiceClient = grpc.makeGenericClientConstructor(RaftServiceService, 'RaftService');

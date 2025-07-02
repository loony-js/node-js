// package: raft
// file: raft.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class AliveReq extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AliveReq.AsObject;
    static toObject(includeInstance: boolean, msg: AliveReq): AliveReq.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AliveReq, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AliveReq;
    static deserializeBinaryFromReader(message: AliveReq, reader: jspb.BinaryReader): AliveReq;
}

export namespace AliveReq {
    export type AsObject = {
    }
}

export class AliveRes extends jspb.Message { 
    getAlive(): boolean;
    setAlive(value: boolean): AliveRes;

    hasNode(): boolean;
    clearNode(): void;
    getNode(): NodeInfo | undefined;
    setNode(value?: NodeInfo): AliveRes;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AliveRes.AsObject;
    static toObject(includeInstance: boolean, msg: AliveRes): AliveRes.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AliveRes, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AliveRes;
    static deserializeBinaryFromReader(message: AliveRes, reader: jspb.BinaryReader): AliveRes;
}

export namespace AliveRes {
    export type AsObject = {
        alive: boolean,
        node?: NodeInfo.AsObject,
    }
}

export class NodeInfo extends jspb.Message { 
    getLength(): number;
    setLength(value: number): NodeInfo;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): NodeInfo.AsObject;
    static toObject(includeInstance: boolean, msg: NodeInfo): NodeInfo.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: NodeInfo, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): NodeInfo;
    static deserializeBinaryFromReader(message: NodeInfo, reader: jspb.BinaryReader): NodeInfo;
}

export namespace NodeInfo {
    export type AsObject = {
        length: number,
    }
}

export class HeartbeatReq extends jspb.Message { 
    getTerm(): number;
    setTerm(value: number): HeartbeatReq;
    getLeaderid(): number;
    setLeaderid(value: number): HeartbeatReq;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HeartbeatReq.AsObject;
    static toObject(includeInstance: boolean, msg: HeartbeatReq): HeartbeatReq.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HeartbeatReq, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HeartbeatReq;
    static deserializeBinaryFromReader(message: HeartbeatReq, reader: jspb.BinaryReader): HeartbeatReq;
}

export namespace HeartbeatReq {
    export type AsObject = {
        term: number,
        leaderid: number,
    }
}

export class HeartbeatRes extends jspb.Message { 
    getResult(): boolean;
    setResult(value: boolean): HeartbeatRes;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HeartbeatRes.AsObject;
    static toObject(includeInstance: boolean, msg: HeartbeatRes): HeartbeatRes.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HeartbeatRes, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HeartbeatRes;
    static deserializeBinaryFromReader(message: HeartbeatRes, reader: jspb.BinaryReader): HeartbeatRes;
}

export namespace HeartbeatRes {
    export type AsObject = {
        result: boolean,
    }
}

export class VoteReq extends jspb.Message { 
    getTerm(): number;
    setTerm(value: number): VoteReq;
    getCandidateid(): number;
    setCandidateid(value: number): VoteReq;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): VoteReq.AsObject;
    static toObject(includeInstance: boolean, msg: VoteReq): VoteReq.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: VoteReq, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): VoteReq;
    static deserializeBinaryFromReader(message: VoteReq, reader: jspb.BinaryReader): VoteReq;
}

export namespace VoteReq {
    export type AsObject = {
        term: number,
        candidateid: number,
    }
}

export class VoteRes extends jspb.Message { 
    getVotegranted(): boolean;
    setVotegranted(value: boolean): VoteRes;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): VoteRes.AsObject;
    static toObject(includeInstance: boolean, msg: VoteRes): VoteRes.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: VoteRes, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): VoteRes;
    static deserializeBinaryFromReader(message: VoteRes, reader: jspb.BinaryReader): VoteRes;
}

export namespace VoteRes {
    export type AsObject = {
        votegranted: boolean,
    }
}

export class AppendEntriesReq extends jspb.Message { 
    getTerm(): number;
    setTerm(value: number): AppendEntriesReq;
    getLeaderid(): number;
    setLeaderid(value: number): AppendEntriesReq;
    getPrevlogindex(): number;
    setPrevlogindex(value: number): AppendEntriesReq;
    getPrevlogterm(): number;
    setPrevlogterm(value: number): AppendEntriesReq;
    getEntries(): string;
    setEntries(value: string): AppendEntriesReq;
    getLeadercommit(): number;
    setLeadercommit(value: number): AppendEntriesReq;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AppendEntriesReq.AsObject;
    static toObject(includeInstance: boolean, msg: AppendEntriesReq): AppendEntriesReq.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AppendEntriesReq, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AppendEntriesReq;
    static deserializeBinaryFromReader(message: AppendEntriesReq, reader: jspb.BinaryReader): AppendEntriesReq;
}

export namespace AppendEntriesReq {
    export type AsObject = {
        term: number,
        leaderid: number,
        prevlogindex: number,
        prevlogterm: number,
        entries: string,
        leadercommit: number,
    }
}

export class AppendEntriesRes extends jspb.Message { 
    getSuccess(): boolean;
    setSuccess(value: boolean): AppendEntriesRes;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AppendEntriesRes.AsObject;
    static toObject(includeInstance: boolean, msg: AppendEntriesRes): AppendEntriesRes.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AppendEntriesRes, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AppendEntriesRes;
    static deserializeBinaryFromReader(message: AppendEntriesRes, reader: jspb.BinaryReader): AppendEntriesRes;
}

export namespace AppendEntriesRes {
    export type AsObject = {
        success: boolean,
    }
}

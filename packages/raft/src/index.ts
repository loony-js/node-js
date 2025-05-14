/* eslint-disable @typescript-eslint/no-explicit-any */
import process from "node:process"
import { RaftNode } from "./raftNode-v1"
import config from "./config.json"
import { server as grpcServer } from "./grpc.server"
import { client as grpcClient } from "./grpc.client"
import * as grpc from "@grpc/grpc-js"

const ports = config.ports

const nodeExists = () => {
  return new Promise((resolve, reject) => {
    grpcClient.PingRequest({}, (err: any) => {
      if (err) {
        reject(false)
      } else {
        resolve(true)
      }
    })
  })
}

;(async () => {
  let port = null
  let c = 0
  while (c !== ports.length) {
    try {
      await nodeExists()
      c += 1
    } catch (err) {
      console.log(err)
      port = ports[c]
      c += 1
      break
    }
  }

  if (!port) {
    process.exit()
  }

  class RaftHandler extends RaftNode {}

  new RaftHandler(port, ports)

  const url = `0.0.0.0:${port}`
  grpcServer.bindAsync(url, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`gRPC server running at ${url}`)
    // server.start()
  })
})()

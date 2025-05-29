/* eslint-disable @typescript-eslint/no-explicit-any */
import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import path from "path"

const PROTO_PATH = path.resolve(__dirname, "./proto/greeter.proto")

// Load proto
const packageDef = protoLoader.loadSync(PROTO_PATH, {})
const grpcObject = grpc.loadPackageDefinition(packageDef) as any
const greeterPackage = grpcObject.greeter

// Implement the service
const sayHello = (
  call: grpc.ServerUnaryCall<any, any>,
  callback: grpc.sendUnaryData<any>,
) => {
  callback(null, { message: `Hello, ${call.request.name}!` })
}

// Setup server
const server = new grpc.Server()
server.addService(greeterPackage.Greeter.service, { SayHello: sayHello })
server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start()
    console.log("gRPC server started on port 50051")
  },
)

// Create client
const client = new greeterPackage.Greeter(
  "localhost:50051",
  grpc.credentials.createInsecure(),
)

// Call SayHello
client.SayHello({ name: "Lovegood" }, (err: any, response: any) => {
  if (err) console.error(err)
  else console.log("Greeting:", response.message)
})

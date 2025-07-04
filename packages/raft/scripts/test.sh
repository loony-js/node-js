#!/bin/bash

curl http://localhost:2000/
curl http://localhost:2000/logStatus

curl http://localhost:2000/nodeStatus
curl http://localhost:2001/nodeStatus
curl http://localhost:2002/nodeStatus

curl http://localhost:2000/entries
curl http://localhost:2001/entries
curl http://localhost:2002/entries

sleep 5

PORT=2000 PEER_ADDRESS=50050 node ./dist/index.js
PORT=2001 PEER_ADDRESS=50051 node ./dist/index.js
PORT=2002 PEER_ADDRESS=50052 node ./dist/index.js

curl -X POST http://localhost:2000/set \
     -H "Content-Type: application/json" \
     -d '{"command": "select * from users"}'


npx grpc_tools_node_protoc   --js_out=import_style=commonjs,binary:./generated   --grpc_out=grpc_js:./generated   --ts_out=grpc_js:./generated   --proto_path=./protos   ./protos/raft.proto

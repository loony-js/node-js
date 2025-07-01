#!/bin/bash

curl http://localhost:2000/connectPeers
curl http://localhost:2001/connectPeers
curl http://localhost:2002/connectPeers

sleep 5

PORT=2000 PEER_ADDRESS=50050 node ./dist/index.js
PORT=2001 PEER_ADDRESS=50051 node ./dist/index.js
PORT=2002 PEER_ADDRESS=50052 node ./dist/index.js
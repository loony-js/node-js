#!/bin/bash

curl http://localhost:2000/connectPeers
curl http://localhost:2001/connectPeers
curl http://localhost:2002/connectPeers

sleep 5

curl http://localhost:2000/pingPeers
curl http://localhost:2001/pingPeers
curl http://localhost:2002/pingPeers


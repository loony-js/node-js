#!/bin/bash

curl -X POST http://localhost:2000/encrypt \
     -H "Content-Type: application/json" \
     -d '{"text": "", "password": ""}'

# curl -X POST http://localhost:2000/decrypt \
#      -H "Content-Type: application/json" \
#      -d '{"text": "", "password": ""}'

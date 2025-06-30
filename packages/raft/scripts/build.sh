#!/bin/bash

echo "Clean building typescript files to javascript..."

rm -rf dist && tsc
cp -r protos dist/

echo "Copied protos to dist/"
echo "Build Completed."

echo "Run the app. PORT=2000 PEER_ADDRESS=50050 node ./dist/index.js"
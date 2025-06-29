#!/bin/bash

echo "Clean building typescript files to javascript..."

rm -rf dist && tsc
cp -r protos dist/

echo "Copied protos to dist/"
echo "Build Completed."

echo "Run the app. GRPC_PORT=<> node ./dist/index.js"
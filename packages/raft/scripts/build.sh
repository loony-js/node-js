#!/bin/bash

echo "Clean building typescript files to javascript..."

rm -rf dist && tsc
cp -r protos dist/

echo "Copied protos to dist/"
echo "Completed"
#!/bin/bash

rm -rf lib
rm -rf dist
rm -rf types

echo "Removed lib/ dist/"

tsc

echo "Build complete."


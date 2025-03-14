#!/bin/bash

rm -rf dist
echo "Removed previous build directory."
echo "New build"
tsc
echo "Build completed."
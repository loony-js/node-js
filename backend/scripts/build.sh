#!/bin/bash

cd ..
rm -rf build
echo "Removed previous build directory."
echo "New build"
tsc
echo "Build completed."
#!/bin/bash

rm -rf dist

tsc

node dist/index.js
#!/bin/sh

echo "watching sample.sol..."

when-changed sample.sol ./compile.sh

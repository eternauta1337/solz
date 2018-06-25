#!/bin/sh

echo "changes detected > compiling sample.sol"

solc --overwrite --ast -o . sample.sol
cat sample.sol.ast

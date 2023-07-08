#!/bin/bash

set -e

echo "Generating music..."
while true
do
    TOKENIZERS_PARALLELISM=false time .venv/bin/python generate.py --cat ambience --text "ambient soundscape with birds singing"
done
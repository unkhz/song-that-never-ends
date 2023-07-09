#!/bin/bash

set -e

echo "Generating music..."
while true
do
    latest_file=$(ls -t1 ../server/audio/voice/*.aiff | head -n 1)
    time .venv/bin/python generate.py \
        --category ambience \
        --text "ambient soundscape with 8bit music tone" \
        --duration 12 \
        --input "$latest_file"
done
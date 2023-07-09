#!/bin/bash

set -e

while true
do
    latest_file=$(ls -t1 ../server/audio/voice/*.aiff | head -n 1)
    time conda run -n .venv python generate.py \
        --category ambience \
        --text "ambient soundscape with 8bit music tone" \
        --duration 12 \
        --input "$latest_file"
done
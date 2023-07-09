#!/bin/bash

set -e

while true
do
    latest_file=$(ls -t1 ../server/audio/voice/*.aiff | head -n 1)
    time conda run -n .venv python generate.py \
        --category ambience \
        --text "8bit soft harmonies and no clear rythm" \
        --duration 20 \
        --input "$latest_file"
done
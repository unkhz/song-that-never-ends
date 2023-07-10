#!/bin/bash

set -e

CATEGORY=guitar
CATEGORY_INPUTS="../server/audio/guitar-draft.aif"
CATEGORY_OUTPUT_DIR="../server/audio/$CATEGORY"

mkdir -p "$CATEGORY_OUTPUT_DIR"

while true
do
    latest_file=$(ls -t1 $CATEGORY_INPUTS | head -n 1)
    time conda run -n .venv python generate.py \
        --output "$CATEGORY_OUTPUT_DIR/$(date +%s).mp3" \
        --text "mellow electric piano and bass" \
        --duration 40 \
        --input "$latest_file"
done
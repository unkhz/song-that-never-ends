#!/bin/bash

set -e

duration=120
rclone_s3_bucket="song-that-never-ends"

function generate() {
    local category=$1
    local text=$2

    category_inputs="./audio/guitar-draft.aif"
    category_output_dir="./audio/$category"
    filename="$(date +%s).mp3"

    mkdir -p "$category_output_dir"
    echo "Generating $duration seconds of $text"
    latest_file=$(ls -t1 "$category_inputs" | head -n 1)
    time conda run -n music python generate.py \
        --output "$category_output_dir/$filename" \
        --text "$text" \
        --duration $duration \
        --input "$latest_file"

    echo $filename >> "$category_output_dir/contents.txt"
    rclone copy audio/$category/$filename $rclone_s3_bucket:music/$category/
    rclone copy audio/$category/contents.txt $rclone_s3_bucket:music/$category/
}

while true
do
    generate "violin-music" "romantic chamber music with violin and cello"
    generate "violin-music-chorus" "symphony orchestra with violing soloist"
done
import datetime
import argparse
from transformers import AutoProcessor, MusicgenForConditionalGeneration
from pydub import AudioSegment
import numpy as np


def write(f, sr, x, normalized=False):
    """numpy array to MP3"""
    channels = 2 if (x.ndim == 2 and x.shape[1] == 2) else 1
    if normalized:  # normalized array - each item should be a float in [-1, 1)
        y = np.int16(x * 2**15)
    else:
        y = np.int16(x)
    track = AudioSegment(y.tobytes(), frame_rate=sr, sample_width=2, channels=channels)
    track.export(f, format="mp3", bitrate="320k")


def main(args):
    processor = AutoProcessor.from_pretrained("facebook/musicgen-small")
    model = MusicgenForConditionalGeneration.from_pretrained("facebook/musicgen-small")

    inputs = processor(
        text=args.text,
        padding=True,
        return_tensors="pt",
    )

    audio_values = model.generate(**inputs, max_new_tokens=512)
    sampling_rate = model.config.audio_encoder.sampling_rate
    date = int(datetime.datetime.now().timestamp())
    filename = "../server/audio/" + str(args.cat[0]) + "/" + str(date) + ".mp3"
    write(f=filename, sr=sampling_rate, x=audio_values[0, 0].numpy(), normalized=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--cat", nargs="+", help="Category of the music")
    parser.add_argument("--text", nargs="+", help="Text input for music genenration")
    args = parser.parse_args()
    main(args)

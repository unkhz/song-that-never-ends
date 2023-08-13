import datetime
import argparse
import torchaudio
from audiocraft.models import MusicGen
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
    track.export(f, format="mp3", bitrate="96k")


def main(args):
    descriptions = args.text
    duration = int(args.duration[0])
    input_filename = str(args.input[0])
    output_filename = str(args.output[0])

    # Read the melody from the song
    melody, melody_sr = torchaudio.load(input_filename)

    # Generate music using the melody and the provided description
    model = MusicGen.get_pretrained("melody", device='cuda')
    model.set_generation_params(duration=duration)  # generate 8 seconds.
    audio_values = model.generate_with_chroma(
        descriptions,
        melody_wavs=melody[None].expand(1, -1, -1),
        melody_sample_rate=melody_sr,
        progress=False,
    )

    write(
        f=output_filename,
        sr=model.sample_rate,
        x=audio_values[0, 0].cpu().numpy(),
        normalized=True,
    )

    print("Generated " + output_filename)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", nargs=1, help="Input audio for the music")
    parser.add_argument("--duration", nargs=1, help="Duration of the music")
    parser.add_argument("--output", nargs=1, help="File to save the generated music")
    parser.add_argument("--text", nargs=1, help="Text input for music genenration")
    args = parser.parse_args()
    main(args)

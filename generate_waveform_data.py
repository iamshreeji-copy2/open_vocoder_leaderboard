"""
generate_waveform_data.py
Extracts genuine time (s) vs amplitude waveform data from all WAV files in assets/audio_samples/
Outputs data/waveform_data.js and data/waveform_data.json
"""

import os
import wave
import json
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
AUDIO_DIR = os.path.join(BASE_DIR, "assets", "audio_samples")
DATA_DIR = os.path.join(BASE_DIR, "data")

waveforms = {}

conditions = sorted([d for d in os.listdir(AUDIO_DIR) if os.path.isdir(os.path.join(AUDIO_DIR, d))])

for tag in conditions:
    tag_dir = os.path.join(AUDIO_DIR, tag)
    waveforms[tag] = {}
    wav_files = sorted([f for f in os.listdir(tag_dir) if f.endswith(".wav")])

    for fname in wav_files:
        mid = fname[:-4]
        p = os.path.join(tag_dir, fname)

        try:
            with wave.open(p, "rb") as w:
                nframes = w.getnframes()
                rate = w.getframerate()
                sampwidth = w.getsampwidth()
                raw = w.readframes(nframes)

                if sampwidth == 2:
                    samples = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
                elif sampwidth == 4:
                    samples = np.frombuffer(raw, dtype=np.float32)
                else:
                    continue

                dur = nframes / float(rate)
                target_pts = 600
                chunk_size = max(1, len(samples) // target_pts)
                num_chunks = len(samples) // chunk_size
                trimmed = samples[:num_chunks * chunk_size].reshape((num_chunks, chunk_size))
                mins = trimmed.min(axis=1)
                maxs = trimmed.max(axis=1)
                times = np.linspace(0, dur, num_chunks)

                peak = float(np.max(np.abs(samples)))
                rms = float(np.sqrt(np.mean(samples**2)))
                rms_db = 20.0 * np.log10(rms + 1e-9)

                waveforms[tag][mid] = {
                    "dur": round(dur, 2),
                    "sr": rate,
                    "peak": round(peak, 3),
                    "rms": round(rms_db, 1),
                    "t": [round(float(t), 2) for t in times],
                    "min": [round(float(v), 3) for v in mins],
                    "max": [round(float(v), 3) for v in maxs]
                }
        except Exception as e:
            print(f"Error reading {p}: {e}")

# Save to data/waveform_data.json
json_path = os.path.join(DATA_DIR, "waveform_data.json")
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(waveforms, f)
print(f"[✓] Wrote {json_path}")

# Save to data/waveform_data.js for zero-latency direct inclusion in HTML
js_path = os.path.join(DATA_DIR, "waveform_data.js")
with open(js_path, "w", encoding="utf-8") as f:
    f.write("/* Auto-generated genuine audio waveforms: Time (s) vs Amplitude */\n")
    f.write("window.PRISM_WAVEFORMS = ")
    json.dump(waveforms, f)
    f.write(";\n")
print(f"[✓] Wrote {js_path}")

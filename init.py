#!/usr/bin/env python3
"""
init.py — Open Neural Vocoder Leaderboard
Pre-launch verification: checks all data files, audio samples, and core functions.
Run before git push to confirm the space is deployment-ready.
"""

import os, sys, json
import pandas as pd

BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
DATA_DIR   = os.path.join(BASE_DIR, "data")
ASSETS_DIR = os.path.join(BASE_DIR, "assets")
AUDIO_DIR  = os.path.join(ASSETS_DIR, "audio_samples")

REQUIRED_DATA = [
    "leaderboard_data.csv",
    "leaderboard_data.json",
    "phoneme_diagnostics.csv",
    "dataset_breakdown.csv",
    "arena_manifest.json",
]

REQUIRED_AUDIO_DIRS = [
    "clean_reading_ljspeech",
    "multispeaker_libritts",
    "accented_vctk",
    "device_noisy_freest",
]

EXPECTED_MODEL_IDS = [
    "hifigan_universal_v1",
    "bigvgan_base_24khz_100band",
    "bigvgan_v2_24khz_100band_256x",
    "vocos_mel_24khz",
    "rfwave_libritts_24k",
    "griffin_lim",
    "flow2gan",
    "comvo_base",
    "comvo_large",
    "wavefm",
    "rndvoc",
    "bridgevoc",
    "freev",
    "periodwave_turbo",
    "periodwave_24k",
]

PASS = "✅"
FAIL = "❌"
WARN = "⚠️ "

errors = []

print("=" * 60)
print("  Open Neural Vocoder Leaderboard — Pre-launch Audit")
print("=" * 60)

# 1. Data files
print("\n[1] Data files:")
for fname in REQUIRED_DATA:
    p = os.path.join(DATA_DIR, fname)
    exists = os.path.exists(p)
    size   = os.path.getsize(p) if exists else 0
    status = PASS if (exists and size > 100) else FAIL
    if not (exists and size > 100):
        errors.append(f"Missing or empty: data/{fname}")
    print(f"  {status} data/{fname}  ({size:,} bytes)")

# 2. Leaderboard data integrity
print("\n[2] Leaderboard data integrity:")
try:
    lb = pd.read_csv(os.path.join(DATA_DIR, "leaderboard_data.csv"))
    missing_models = set(EXPECTED_MODEL_IDS) - set(lb["model_id"].tolist())
    n = len(lb)
    ok = n == 15 and not missing_models
    print(f"  {PASS if ok else FAIL} {n} models loaded (expected 15)")
    if missing_models:
        print(f"  {FAIL} Missing models: {missing_models}")
        errors.append(f"Missing model rows: {missing_models}")
    required_cols = ["model_id","model_name","pesq","stoi","utmos","rtf","overall_score",
                     "is_pareto","edge_feasible","peak_vram_mb","speedup_x"]
    for col in required_cols:
        if col not in lb.columns:
            print(f"  {FAIL} Missing column: {col}")
            errors.append(f"Missing column in leaderboard_data.csv: {col}")
    if not missing_models:
        print(f"  {PASS} All 15 models present. Rank 1: {lb[lb['rank']==1]['model_name'].values[0]}")
except Exception as e:
    errors.append(f"leaderboard_data.csv error: {e}")
    print(f"  {FAIL} Error: {e}")

# 3. Phoneme diagnostics
print("\n[3] Phoneme diagnostics:")
try:
    ph = pd.read_csv(os.path.join(DATA_DIR, "phoneme_diagnostics.csv"))
    print(f"  {PASS} {len(ph)} rows ({ph['model_id'].nunique()} models × {ph['phonetic_class'].nunique()} phonetic classes)")
except Exception as e:
    errors.append(f"phoneme_diagnostics.csv error: {e}")
    print(f"  {FAIL} Error: {e}")

# 4. Dataset breakdown
print("\n[4] Dataset breakdown:")
try:
    ds = pd.read_csv(os.path.join(DATA_DIR, "dataset_breakdown.csv"))
    print(f"  {PASS} {len(ds)} rows ({ds['model_id'].nunique()} models × {ds['dataset'].nunique()} datasets)")
except Exception as e:
    errors.append(f"dataset_breakdown.csv error: {e}")
    print(f"  {FAIL} Error: {e}")

# 5. Audio arena manifest
print("\n[5] Audio arena manifest:")
try:
    with open(os.path.join(DATA_DIR, "arena_manifest.json")) as f:
        arena = json.load(f)
    print(f"  {PASS} {len(arena)} utterances in manifest")
    for item in arena:
        print(f"       · {item['tag']}: {item['description']}")
except Exception as e:
    errors.append(f"arena_manifest.json error: {e}")
    print(f"  {FAIL} Error: {e}")

# 6. Audio sample directories
print("\n[6] Audio sample WAV files:")
for d in REQUIRED_AUDIO_DIRS:
    dir_p = os.path.join(AUDIO_DIR, d)
    if not os.path.isdir(dir_p):
        print(f"  {FAIL} Missing directory: assets/audio_samples/{d}/")
        errors.append(f"Missing audio dir: {d}")
        continue
    wavs = [f for f in os.listdir(dir_p) if f.endswith(".wav")]
    expected_wavs = len(EXPECTED_MODEL_IDS) + 1   # models + ground_truth
    ok = len(wavs) == expected_wavs
    gt_ok = "ground_truth.wav" in wavs
    print(f"  {PASS if ok and gt_ok else FAIL} assets/audio_samples/{d}/  "
          f"→ {len(wavs)} WAVs (expected {expected_wavs}, GT: {PASS if gt_ok else FAIL})")
    if not ok:
        errors.append(f"Wrong WAV count in {d}: got {len(wavs)}, expected {expected_wavs}")

# 7. No absolute paths in pushed files
print("\n[7] Checking for hardcoded absolute paths in app.py / constants.py:")
local_prefix = "/home/"
for fname in ["app.py", "constants.py", "utils_display.py"]:
    fpath = os.path.join(BASE_DIR, fname)
    if not os.path.exists(fpath):
        continue
    lines_with_abs = []
    with open(fpath) as f:
        for i, line in enumerate(f, 1):
            if local_prefix in line and "# noqa" not in line:
                lines_with_abs.append(i)
    if lines_with_abs:
        print(f"  {WARN}{fname}: lines with absolute paths: {lines_with_abs}")
    else:
        print(f"  {PASS} {fname}: no hardcoded absolute paths")

# 8. Import check
print("\n[8] Import test:")
try:
    sys.path.insert(0, BASE_DIR)
    import importlib, app as _app
    print(f"  {PASS} app.py imported successfully")
except Exception as e:
    errors.append(f"app.py import error: {e}")
    print(f"  {FAIL} app.py import error: {e}")

# ── Summary ───────────────────────────────────────────────────────────────────
print("\n" + "=" * 60)
if errors:
    print(f"  {FAIL} AUDIT FAILED — {len(errors)} issue(s) found:")
    for e in errors:
        print(f"     • {e}")
    sys.exit(1)
else:
    print(f"  {PASS} AUDIT PASSED — Space is ready to push to Hugging Face!")
    print("  Run: git add . && git commit -m 'Initial push' && git push")
print("=" * 60)

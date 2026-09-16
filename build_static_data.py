"""
build_static_data.py
Generates data/prism_data.js and data/prism_full_data.json from CSVs and constants.py
for zero-latency, 100% static, client-side rendering on GitHub Pages.
"""

import os
import json
import pandas as pd
import numpy as np

import constants

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

# Load raw files
df_lb = pd.read_csv(os.path.join(DATA_DIR, "leaderboard_data.csv"))
df_ds = pd.read_csv(os.path.join(DATA_DIR, "dataset_breakdown.csv"))
df_phone = pd.read_csv(os.path.join(DATA_DIR, "phoneme_diagnostics.csv"))
with open(os.path.join(DATA_DIR, "arena_manifest.json")) as f:
    arena_manifest = json.load(f)

# Separate baseline and neural models: neural models ranked 1 to 14
df_baseline = df_lb[df_lb["model_id"] == "griffin_lim"].copy()
df_neural = df_lb[df_lb["model_id"] != "griffin_lim"].sort_values("overall_score", ascending=False).reset_index(drop=True)
df_neural["rank"] = range(1, len(df_neural) + 1)
df_baseline["rank"] = 0
df_lb = pd.concat([df_baseline, df_neural]).reset_index(drop=True)

# Enrich leaderboard models
leaderboard_models = []
dataset_names = ["LJSpeech", "LibriTTS", "VCTK", "Free_ST"]

for _, r in df_lb.iterrows():
    mid = r["model_id"]
    os_status = constants.MODEL_OS_STATUS.get(mid, {"code_open": True, "ckpt_open": True})
    links = constants.MODEL_LINKS.get(mid, {})
    arch_cat = constants.MODEL_ARCH_CATEGORY.get(mid, "GAN-based")
    arch_tags = list(constants.MODEL_ARCH_TAGS.get(mid, set()))

    # Extract per-dataset metrics
    ds_sub = df_ds[df_ds["model_id"] == mid]
    ds_pesqs = {}
    ds_metrics = {}
    for d in dataset_names:
        d_row = ds_sub[ds_sub["dataset"] == d]
        if not d_row.empty:
            p_val = float(d_row["pesq"].values[0])
            s_val = float(d_row["stoi"].values[0])
            l_val = float(d_row["lsd_db"].values[0])
            m_val = float(d_row["mcd_db"].values[0])
            ds_pesqs[d] = p_val
            ds_metrics[d] = {
                "pesq": p_val,
                "stoi": s_val,
                "lsd_db": l_val,
                "mcd_db": m_val
            }
        else:
            ds_pesqs[d] = None
            ds_metrics[d] = None

    sys_id = str(r.get("system_id", "")) if pd.notna(r.get("system_id")) else constants.MODEL_SYSTEM_ID.get(mid, "")
    is_base = (mid == "griffin_lim")

    model_dict = {
        "system_id": sys_id,
        "is_baseline": is_base,
        "model_id": mid,
        "model_name": r["model_name"],
        "architecture_family": r["architecture_family"],
        "arch_category": arch_cat,
        "arch_tags": arch_tags,
        "track": r["track"],
        "sampling_rate_hz": int(r["sampling_rate_hz"]),
        "params_m": float(r["params_m"]),
        "overall_score": float(r["overall_score"]),
        "pesq": float(r["pesq"]),
        "stoi": float(r["stoi"]),
        "mcd_db": float(r["mcd_db"]),
        "lsd_db": float(r["lsd_db"]),
        "utmos": float(r["utmos"]),
        "nisqa": float(r["nisqa"]),
        "delta_wer_pct": float(r["delta_wer_pct"]),
        "rtf": float(r["rtf"]),
        "speedup_x": float(r["speedup_x"]),
        "peak_vram_mb": float(r["peak_vram_mb"]),
        "edge_feasible": r["edge_feasible"],
        "is_pareto": bool(r["is_pareto"]),
        "checkpoint_url": links.get("checkpoint", r.get("checkpoint_url", "")),
        "paper_url": links.get("paper", r.get("paper_url", "")),
        "github_url": links.get("github", ""),
        "license": r["license"],
        "author": r["author"],
        "year": int(r["year"]),
        "rank": int(r["rank"]),
        "code_open": os_status["code_open"],
        "ckpt_open": os_status["ckpt_open"],
        "dataset_pesqs": ds_pesqs,
        "dataset_metrics": ds_metrics
    }
    leaderboard_models.append(model_dict)

dataset_breakdown = df_ds.to_dict(orient="records")
phoneme_diagnostics = df_phone.to_dict(orient="records")

full_data = {
    "identity": {
        "name": constants.PRISM_NAME,
        "full_name": constants.PRISM_FULL,
        "tagline": constants.PRISM_TAGLINE,
        "description": constants.PRISM_DESC,
        "version": constants.PRISM_VERSION,
        "github_url": constants.GITHUB_URL,
    },
    "arch_categories": constants.ARCH_CATEGORIES,
    "model_arch_tags": {k: list(v) for k, v in constants.MODEL_ARCH_TAGS.items()},
    "model_arch_category": constants.MODEL_ARCH_CATEGORY,
    "arch_family_to_category": constants.ARCH_FAMILY_TO_CATEGORY,
    "model_system_id": constants.MODEL_SYSTEM_ID,
    "model_os_status": constants.MODEL_OS_STATUS,
    "model_links": constants.MODEL_LINKS,
    "datasets": constants.DATASETS,
    "tracks": constants.TRACKS,
    "metric_defs": {k: {"title": v[0], "direction": v[1], "description": v[2]} for k, v in constants.METRIC_DEFS.items()},
    "column_groups": constants.COLUMN_GROUPS,
    "family_colors": constants.FAMILY_COLORS,
    "arch_cat_colors": constants.ARCH_CAT_COLORS,
    "phone_classes": constants.PHONE_CLASSES,
    "bibtex": constants.BIBTEX,
    "methodology_md": constants.METHODOLOGY_MD,
    "changelog_md": constants.CHANGELOG_MD,
    "leaderboard": leaderboard_models,
    "dataset_breakdown": dataset_breakdown,
    "phoneme_diagnostics": phoneme_diagnostics,
    "arena_manifest": arena_manifest
}

# Write JSON
json_path = os.path.join(DATA_DIR, "prism_full_data.json")
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(full_data, f, indent=2, ensure_ascii=False)
print(f"[✓] Wrote {json_path}")

# Write JS wrapper for zero-latency inclusion in HTML without CORS restrictions
js_path = os.path.join(DATA_DIR, "prism_data.js")
with open(js_path, "w", encoding="utf-8") as f:
    f.write("/* Auto-generated PRISM-V benchmark dataset */\n")
    f.write("window.PRISM_DATA = ")
    json.dump(full_data, f, indent=2, ensure_ascii=False)
    f.write(";\n")
print(f"[✓] Wrote {js_path}")

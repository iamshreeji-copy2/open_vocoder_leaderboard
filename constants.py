"""
constants.py — PRISM-V: Open Neural Vocoder Evaluation
All model metadata, open-source status, architecture taxonomy, and static content.
"""

# ── PRISM-V Identity ──────────────────────────────────────────────────────────
PRISM_NAME    = "PRISM-V"
PRISM_FULL    = "PRISM-V: Open Evaluation of Pretrained Neural Vocoders"
PRISM_TAGLINE = "Quality · Robustness · Generalization · Efficiency"
PRISM_DESC    = (
    "The 🤗 PRISM-V Leaderboard evaluates open-source and pretrained neural vocoders on English "
    "across diverse acoustic conditions, generative architectures, and edge deployment profiles."
)
PRISM_VERSION = "v1.0.1"
GITHUB_URL    = "https://github.com/open-vocoder-leaderboard"

# ── Architecture Taxonomy ─────────────────────────────────────────────────────
#  Used for the architecture filter pills (multi-select supported)
ARCH_CATEGORIES = [
    "GAN-based",
    "Fourier / Transformer-based",
    "Flow-based",
    "Diffusion-based",
    "Non-Autoregressive",
    "Autoregressive",
    "Algorithmic DSP",
]

# Model ID to full set of architecture tags for multi-criteria filtering
MODEL_ARCH_TAGS = {
    "hifigan_universal_v1":           {"GAN-based", "Non-Autoregressive"},
    "bigvgan_base_24khz_100band":     {"GAN-based", "Non-Autoregressive"},
    "bigvgan_v2_24khz_100band_256x":  {"GAN-based", "Non-Autoregressive"},
    "freev":                          {"GAN-based", "Non-Autoregressive"},
    "rndvoc":                         {"GAN-based", "Non-Autoregressive"},
    "vocos_mel_24khz":                {"Fourier / Transformer-based", "Non-Autoregressive"},
    "comvo_base":                     {"Fourier / Transformer-based", "Non-Autoregressive"},
    "comvo_large":                    {"Fourier / Transformer-based", "Non-Autoregressive"},
    "rfwave_libritts_24k":            {"Flow-based", "Non-Autoregressive"},
    "wavefm":                         {"Flow-based", "Non-Autoregressive"},
    "flow2gan":                       {"Flow-based", "GAN-based", "Non-Autoregressive"},
    "bridgevoc":                      {"Diffusion-based", "Non-Autoregressive"},
    "periodwave_turbo":               {"Diffusion-based", "Non-Autoregressive"},
    "periodwave_24k":                 {"Diffusion-based", "Non-Autoregressive"},
    "griffin_lim":                    {"Algorithmic DSP"},
}

# Maps model_id → primary architecture category (for display)
MODEL_ARCH_CATEGORY = {
    "hifigan_universal_v1":           "GAN-based",
    "bigvgan_base_24khz_100band":     "GAN-based",
    "bigvgan_v2_24khz_100band_256x":  "GAN-based",
    "freev":                          "GAN-based",
    "rndvoc":                         "GAN-based",
    "vocos_mel_24khz":                "Fourier / Transformer-based",
    "comvo_base":                     "Fourier / Transformer-based",
    "comvo_large":                    "Fourier / Transformer-based",
    "rfwave_libritts_24k":            "Flow-based",
    "wavefm":                         "Flow-based",
    "flow2gan":                       "Flow-based",
    "bridgevoc":                      "Diffusion-based",
    "periodwave_turbo":               "Diffusion-based",
    "periodwave_24k":                 "Diffusion-based",
    "griffin_lim":                    "Algorithmic DSP",
}

# Maps architecture family label → category
ARCH_FAMILY_TO_CATEGORY = {
    "Anti-Aliased Snake GAN":   "GAN-based",
    "Fourier / iSTFT ConvNeXt": "Fourier / Transformer-based",
    "Complex-Valued Fourier":   "Fourier / Transformer-based",
    "Flow Matching + GAN":      "Flow-based",
    "Distilled Flow Matching":  "Flow-based",
    "Rectified Flow Matching":  "Flow-based",
    "Diffusion / Turbo SDE":    "Diffusion-based",
    "Diffusion / Full SDE":     "Diffusion-based",
    "Brownian Bridge SDE":      "Diffusion-based",
    "Time-domain MRF-GAN":      "GAN-based",
    "Pseudo-Inverse Mel GAN":   "GAN-based",
    "Random Distortion GAN":    "GAN-based",
    "Algorithmic DSP Baseline": "Algorithmic DSP",
}

# ── Open-Source Status ────────────────────────────────────────────────────────
#  code_open: Is the training/inference code publicly available?
#  ckpt_open: Is the pretrained checkpoint freely downloadable?
MODEL_OS_STATUS = {
    "hifigan_universal_v1":           {"code_open": True,  "ckpt_open": True},
    "bigvgan_base_24khz_100band":     {"code_open": True,  "ckpt_open": True},
    "bigvgan_v2_24khz_100band_256x":  {"code_open": True,  "ckpt_open": True},
    "vocos_mel_24khz":                {"code_open": True,  "ckpt_open": True},
    "rfwave_libritts_24k":            {"code_open": True,  "ckpt_open": True},
    "griffin_lim":                    {"code_open": True,  "ckpt_open": False},  # algorithmic
    "flow2gan":                       {"code_open": True,  "ckpt_open": True},
    "comvo_base":                     {"code_open": True,  "ckpt_open": True},
    "comvo_large":                    {"code_open": True,  "ckpt_open": True},
    "wavefm":                         {"code_open": True,  "ckpt_open": True},
    "rndvoc":                         {"code_open": True,  "ckpt_open": True},
    "bridgevoc":                      {"code_open": True,  "ckpt_open": True},
    "freev":                          {"code_open": True,  "ckpt_open": True},
    "periodwave_turbo":               {"code_open": True,  "ckpt_open": True},
    "periodwave_24k":                 {"code_open": True,  "ckpt_open": True},
}

# ── Model Links ───────────────────────────────────────────────────────────────
MODEL_LINKS = {
    "hifigan_universal_v1":           {
        "checkpoint": "https://github.com/jik876/hifi-gan",
        "paper":      "https://arxiv.org/abs/2010.05646",
        "github":     "https://github.com/jik876/hifi-gan",
    },
    "bigvgan_base_24khz_100band":     {
        "checkpoint": "https://huggingface.co/nvidia/bigvgan_base_24khz_100band",
        "paper":      "https://arxiv.org/abs/2206.04658",
        "github":     "https://github.com/NVIDIA/BigVGAN",
    },
    "bigvgan_v2_24khz_100band_256x":  {
        "checkpoint": "https://huggingface.co/nvidia/bigvgan_v2_24khz_100band_256x",
        "paper":      "https://arxiv.org/abs/2206.04658",
        "github":     "https://github.com/NVIDIA/BigVGAN",
    },
    "vocos_mel_24khz":                {
        "checkpoint": "https://huggingface.co/charactr/vocos-mel-24khz",
        "paper":      "https://arxiv.org/abs/2306.00814",
        "github":     "https://github.com/hubert-siuzdak/vocos",
    },
    "rfwave_libritts_24k":            {
        "checkpoint": "https://github.com/RF-Wave/RFWave",
        "paper":      "https://arxiv.org/abs/2406.18567",
        "github":     "https://github.com/RF-Wave/RFWave",
    },
    "griffin_lim":                    {
        "checkpoint": "N/A (Algorithmic — no learnable parameters)",
        "paper":      "https://ieeexplore.ieee.org/document/1172092",
        "github":     "https://github.com/librosa/librosa",
    },
    "flow2gan":                       {
        "checkpoint": "https://huggingface.co/k2-fsa/Flow2GAN",
        "paper":      "https://arxiv.org/abs/2405.08819",
        "github":     "https://github.com/k2-fsa/lhotse",
    },
    "comvo_base":                     {
        "checkpoint": "https://huggingface.co/hsoh/ComVo-base",
        "paper":      "https://arxiv.org/abs/2406.19794",
        "github":     "https://github.com/hsoh0306/ComVo",
    },
    "comvo_large":                    {
        "checkpoint": "https://huggingface.co/hsoh/ComVo-large",
        "paper":      "https://arxiv.org/abs/2406.19794",
        "github":     "https://github.com/hsoh0306/ComVo",
    },
    "wavefm":                         {
        "checkpoint": "https://github.com/lucas-ma/WaveFM",
        "paper":      "https://arxiv.org/abs/2406.00287",
        "github":     "https://github.com/lucas-ma/WaveFM",
    },
    "rndvoc":                         {
        "checkpoint": "https://huggingface.co/AndongLi/RNDVoC",
        "paper":      "https://arxiv.org/abs/2406.01257",
        "github":     "https://github.com/AndongLi/RNDVoC",
    },
    "bridgevoc":                      {
        "checkpoint": "https://huggingface.co/AndongLi/BridgeVoC",
        "paper":      "https://arxiv.org/abs/2406.01258",
        "github":     "https://github.com/AndongLi/BridgeVoC",
    },
    "freev":                          {
        "checkpoint": "https://huggingface.co/Bakerbunker/FreeV_Model_Logs",
        "paper":      "https://arxiv.org/abs/2405.15842",
        "github":     "https://github.com/bakerbunker/FreeV",
    },
    "periodwave_turbo":               {
        "checkpoint": "https://github.com/kaist-dsp/PeriodWave",
        "paper":      "https://arxiv.org/abs/2408.06945",
        "github":     "https://github.com/kaist-dsp/PeriodWave",
    },
    "periodwave_24k":                 {
        "checkpoint": "https://github.com/kaist-dsp/PeriodWave",
        "paper":      "https://arxiv.org/abs/2408.06945",
        "github":     "https://github.com/kaist-dsp/PeriodWave",
    },
}

# ── Datasets ───────────────────────────────────────────────────────────────────
DATASETS = {
    "LJSpeech":  "Clean single-speaker studio recording (Linda Johnson, ~22h)",
    "LibriTTS":  "Multi-speaker audiobook, diverse speakers (test-clean + test-other)",
    "VCTK":      "Multi-speaker British/Scottish regional accented speech",
    "Free_ST":   "Real-world mobile microphone, everyday acoustic conditions",
}

# ── Evaluation Tracks ──────────────────────────────────────────────────────────
TRACKS = ["All Tracks", "24kHz Primary Benchmark", "22.05kHz Legacy Track"]

# ── Metric Definitions (for tooltips) ─────────────────────────────────────────
METRIC_DEFS = {
    "PESQ":     ("PESQ — Perceptual Evaluation of Speech Quality", "↑ higher better",
                 "ITU-T P.862 Wideband. Range 1.0–4.5. Measures narrowband spectral distortion against the reference waveform."),
    "STOI":     ("STOI — Short-Time Objective Intelligibility", "↑ higher better",
                 "Measures short-time spectral correlation and envelope intelligibility. Range 0–1. Part of the I (Intelligibility) PRISM-V dimension."),
    "MCD":      ("MCD — Mel-Cepstral Distortion (dB)", "↓ lower better",
                 "Euclidean distance on 13 MFCC coefficients using dynamic time warping. Lower = closer to reference. Part of the R (Reconstruction) PRISM-V dimension."),
    "LSD":      ("LSD — Log-Spectral Distance (dB)", "↓ lower better",
                 "Distance on log STFT magnitude spectrum. Lower = better reconstruction. Part of the R (Reconstruction) PRISM-V dimension."),
    "UTMOS":    ("UTMOS — Universal Text-to-speech MOS", "↑ higher better",
                 "Neural deep MOS predictor trained on crowdsourced MTurk ratings. Range 1–5. Part of the P (Perceptual) PRISM-V dimension."),
    "NISQA":    ("NISQA — Neural Image and Speech Quality Assessment (TTS)", "↑ higher better",
                 "Multi-dimensional TTS naturalness predictor covering Naturalness, Coloration, Discontinuity, and Loudness. Range 1–5. Part of the P (Perceptual) PRISM-V dimension."),
    "ΔWER":     ("ΔWER — Word Error Rate Degradation (%)", "↓ lower better",
                 "NeMo Conformer ASR WER on synthesized output minus WER on reference. 0% = perfect content preservation. Part of the I (Intelligibility) PRISM-V dimension."),
    "RTF":      ("RTF — Real-Time Factor", "↓ lower better",
                 "Processing time divided by audio duration. RTF=0.01 means 100× faster than real-time. Generator-only, Edge Profiling, batch size 1, FP32. Part of the M (Model efficiency) PRISM-V dimension."),
    "xRT":      ("xRT — Throughput Factor (1/RTF)", "↑ higher better",
                 "Audio seconds generated per second of clock time. xRT=100 means 100× real-time. Part of the M (Model efficiency) PRISM-V dimension."),
    "VRAM":     ("Peak VRAM (MB)", "↓ lower better",
                 "Maximum GPU memory allocated during inference. Measured at batch size 1 under Edge Profiling. Part of the M (Model efficiency) PRISM-V dimension."),
    "Params":   ("Parameters (Millions)", "↓ lower better",
                 "Generator model parameter count in millions. Excludes training-only discriminators and preprocessing modules. Part of the M (Model efficiency) PRISM-V dimension."),
    "Score":    ("PRISM-V Score (1–100)", "↑ higher better",
                 "Composite deployment index combining five dimensions: "
                 "P (Perceptual quality via UTMOS + NISQA), "
                 "R (Reconstruction fidelity via PESQ + MCD + LSD), "
                 "I (Intelligibility preservation via STOI + ΔWER), "
                 "S (Speaker preservation via embedding similarity), "
                 "M (Model efficiency via RTF + VRAM + Params). "
                 "Geometric aggregation with hardware feasibility gate under Edge Profiling. "
                 "Score 100 = ideal across all dimensions; score 1 = hardware-infeasible on this profile."),
}

# ── Column Groups ─────────────────────────────────────────────────────────────
#  Each group: (label, css-class, emoji, list of display-col-names)
COLUMN_GROUPS = {
    "prism": {
        "label": "Rank & PRISM-V",
        "emoji": "🏆",
        "css": "col-legend-prism",
        "cols": ["Rank & PRISM-V ↑"],
        "description": "Default composite ranking index combining model rank and PRISM-V score (1–100).",
    },
    "objective": {
        "label": "Objective Metrics",
        "emoji": "📐",
        "css": "col-legend-obj",
        "cols": ["PESQ ↑", "STOI ↑", "MCD ↓", "LSD ↓"],
        "description": "Signal-based mathematical measures computed against reference waveform.",
    },
    "subjective": {
        "label": "Perceptual / Subjective",
        "emoji": "👂",
        "css": "col-legend-subj",
        "cols": ["UTMOS ↑", "NISQA ↑"],
        "description": "Neural predictors trained on human listening study ratings.",
    },
    "performance": {
        "label": "Efficiency & Performance",
        "emoji": "⚡",
        "css": "col-legend-perf",
        "cols": ["RTF ↓", "xRT ↑", "VRAM (MB) ↓", "Params (M)"],
        "description": "Throughput, latency, memory, and model size under Edge Profiling.",
    },
    "robustness": {
        "label": "Robustness / Per-Dataset",
        "emoji": "🛡️",
        "css": "col-legend-rob",
        "cols": ["LJSpeech", "LibriTTS", "VCTK", "Free_ST"],
        "description": "PESQ on each corpus individually — reveals cross-corpus generalisation.",
    },
}

# ── Architecture Family Colors ─────────────────────────────────────────────────
FAMILY_COLORS = {
    "Anti-Aliased Snake GAN":   "#4f46e5",
    "Fourier / iSTFT ConvNeXt": "#0891b2",
    "Complex-Valued Fourier":   "#0284c7",
    "Flow Matching + GAN":      "#8b5cf6",
    "Distilled Flow Matching":  "#a855f7",
    "Rectified Flow Matching":  "#ec4899",
    "Diffusion / Turbo SDE":    "#f59e0b",
    "Diffusion / Full SDE":     "#d97706",
    "Brownian Bridge SDE":      "#ea580c",
    "Time-domain MRF-GAN":      "#10b981",
    "Pseudo-Inverse Mel GAN":   "#14b8a6",
    "Random Distortion GAN":    "#84cc16",
    "Algorithmic DSP Baseline": "#9ca3af",
}

# Architecture category → color for pills
ARCH_CAT_COLORS = {
    "GAN-based":        "#4f46e5",
    "Fourier / iSTFT":  "#0891b2",
    "Flow-based":       "#8b5cf6",
    "Diffusion-based":  "#f59e0b",
    "Algorithmic DSP":  "#9ca3af",
}

# ── ARPAbet Phoneme Classes ────────────────────────────────────────────────────
PHONE_CLASSES = {
    "Vowels":           ["AA","AE","AH","AO","AW","AY","EH","ER","EY","IH","IY","OW","OY","UH","UW"],
    "Stops / Plosives": ["B","D","G","K","P","T"],
    "Fricatives":       ["DH","F","S","SH","TH","V","Z","ZH"],
    "Affricates":       ["CH","JH"],
    "Nasals":           ["M","N","NG"],
    "Liquids":          ["L","R"],
    "Glides":           ["W","Y"],
}

# ── BibTeX ─────────────────────────────────────────────────────────────────────
BIBTEX = """\
@misc{purohit2026prismv,
  author       = {Ravindrakumar M. Purohit and Hemant A. Patil},
  title        = {{PRISM-V}: Multidimensional Evaluation of Pretrained
                  Neural Vocoders for Speech Synthesis},
  year         = {2026},
  howpublished = {Hugging Face Space},
  note         = {Open neural vocoder evaluation leaderboard}
}"""

# ── Methodology Text ────────────────────────────────────────────────────────────
METHODOLOGY_MD = """
## 🧪 Benchmark Protocol

> **Note on Theory & Formal Formulations:**  
> The comprehensive theoretical foundation, axiomatic mathematical formulations, and geometric scoring derivations are presented in the companion paper (see BibTeX citation). This evaluation leaderboard focuses on empirical benchmarking, model comparisons, checkpoint provenance, and interactive audio inspection.

### Design Principles
**PRISM-V** is a **training-free, zero-shot evaluation** of publicly released pretrained checkpoints.
Models are evaluated exactly as practitioners deploy them — no fine-tuning, no cherry-picked test sets.

---

### The Five PRISM-V Dimensions

PRISM-V evaluates **P**erceptual quality · **R**econstruction fidelity · **I**ntelligibility preservation · **S**peaker preservation · **M**odel efficiency (Vocoders).

| Dimension | Evaluation Focus | Key Empirical Measures |
|---|---|---|
| **P — Perceptual quality** | Naturalness & listening perception | UTMOS (neural MOS), NISQA-TTS naturalness |
| **R — Reconstruction fidelity** | Waveform fidelity against reference | PESQ (wideband), MCD (cepstral), LSD (spectral) |
| **I — Intelligibility preservation** | Speech intelligibility & ASR content preservation | STOI (intelligibility), ΔWER (ASR degradation) |
| **S — Speaker preservation** | Speaker identity & acoustic consistency | Speaker embedding cosine similarity |
| **M — Model efficiency** | Real-world execution efficiency on edge hardware | RTF (throughput), Peak VRAM, Parameter count |

The **PRISM-V Score (1–100)** provides a holistic aggregate ranking across all five core dimensions, highlighting models that balance high acoustic fidelity with edge efficiency.

---

### Evaluation Corpora

| Corpus | Acoustic Condition | Utterances | Notes |
|---|---|---|---|
| **LJSpeech** | Clean studio | 2,000 | Single speaker, minimal room acoustics |
| **LibriTTS** | Audiobook | 2,000 | Multi-speaker, test-clean + test-other |
| **VCTK** | Accented | 2,000 | 109 speakers, British/Scottish/Irish accents |
| **Free_ST** | Mobile / Noisy | ~1,980 | Real-world device noise, reverb, varied SNR |

---

### Inference Protocol

| Parameter | Specification |
|---|---|
| **Batch size** | 1 (deployment-realistic stream inference) |
| **Precision** | FP32 |
| **Device Target** | Edge Profiling |
| **Timing** | Warmup runs + measured iterations with CUDA synchronization fences |
| **RTF scope** | Generator-only (excludes mel-spectrogram extraction) |
| **Seed** | Fixed deterministic seed `20260909` where supported |

---

### Coverage and Reliability

The PRISM-V evaluation accounts for synthesis coverage — what fraction of expected utterances were successfully generated.
Every synthesis failure is counted and disclosed. No utterance is silently excluded.

---

### Phoneme-Level Diagnostics

Montreal Forced Aligner (MFA v3) alignments provide phoneme-level boundaries across evaluated utterances.
Spectral distance, F0 pitch deviation, and boundary precision are analyzed per phonetic class:
**Vowels, Stops, Fricatives, Affricates, Nasals, Liquids, and Glides**.

---

### What PRISM-V does NOT do

- ❌ Re-train or fine-tune any model
- ❌ Use unofficial community checkpoints
- ❌ Report metrics only on successful utterances (failures counted in denominators)
- ❌ Mix 22kHz model outputs into the 24kHz primary ranking without notation
- ❌ Score both RTF and xRT simultaneously (they contain identical information)
"""

CHANGELOG_MD = """
## 📋 Release Notes & Changelog

### 🚀 What's New in v1.0.1 (September 12, 2026)
- **🎨 UI & Contrast Enhancements**: High-contrast gold, silver, and bronze rank badges with enhanced visibility across both dark and light modes.
- **✨ Cleaner Visual Experience**: Redesigned model availability chips, streamlined citation blocks, and uncluttered layout.
- **⚡ Performance & Stability**: Upgraded zero-latency client-side theme engine with hardened lifecycle hooks for fluid, lag-free responsiveness.

---

### 📜 Version History

| Version | Release Date | Key Updates |
|---|---|---|
| **v1.0.1** | **September 12, 2026** | High-contrast UI polish, uncluttered citation cards, and client-side engine stability fixes |
| **v1.0.0** | September 10, 2026 | Initial public release: 15 pretrained neural vocoders evaluated across 4 English corpora |
| *v1.1.0* | Upcoming | Additional vocoder families (CodecGAN, DAC-based) and streaming inference benchmarks |
| *v1.2.0* | Planned | Accented and multilingual speech generalization evaluation tracks |
"""

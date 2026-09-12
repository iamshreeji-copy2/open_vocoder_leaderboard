/* Auto-generated PRISM-V benchmark dataset */
window.PRISM_DATA = {
  "identity": {
    "name": "PRISM-V",
    "full_name": "PRISM-V: A Multidimensional Evaluation of Pretrained Neural Vocoders for Speech Synthesis",
    "tagline": "Quality · Robustness · Generalization · Efficiency",
    "description": "The 🤗 PRISM-V Leaderboard evaluates open-source and pretrained neural vocoders on English speech across diverse acoustic conditions, generative architectures, and edge deployment profiles.",
    "version": "v1.0.1",
    "github_url": "https://github.com/open-vocoder-leaderboard"
  },
  "arch_categories": [
    "GAN-based",
    "Fourier / Transformer-based",
    "Flow-based",
    "Diffusion-based",
    "Non-Autoregressive",
    "Autoregressive",
    "Algorithmic DSP"
  ],
  "model_arch_tags": {
    "hifigan_universal_v1": [
      "GAN-based",
      "Non-Autoregressive"
    ],
    "bigvgan_base_24khz_100band": [
      "GAN-based",
      "Non-Autoregressive"
    ],
    "bigvgan_v2_24khz_100band_256x": [
      "GAN-based",
      "Non-Autoregressive"
    ],
    "freev": [
      "GAN-based",
      "Non-Autoregressive"
    ],
    "rndvoc": [
      "GAN-based",
      "Non-Autoregressive"
    ],
    "vocos_mel_24khz": [
      "Fourier / Transformer-based",
      "Non-Autoregressive"
    ],
    "comvo_base": [
      "Fourier / Transformer-based",
      "Non-Autoregressive"
    ],
    "comvo_large": [
      "Fourier / Transformer-based",
      "Non-Autoregressive"
    ],
    "rfwave_libritts_24k": [
      "Flow-based",
      "Non-Autoregressive"
    ],
    "wavefm": [
      "Flow-based",
      "Non-Autoregressive"
    ],
    "flow2gan": [
      "Flow-based",
      "GAN-based",
      "Non-Autoregressive"
    ],
    "bridgevoc": [
      "Non-Autoregressive",
      "Diffusion-based"
    ],
    "periodwave_turbo": [
      "Non-Autoregressive",
      "Diffusion-based"
    ],
    "periodwave_24k": [
      "Non-Autoregressive",
      "Diffusion-based"
    ],
    "griffin_lim": [
      "Algorithmic DSP"
    ]
  },
  "model_arch_category": {
    "hifigan_universal_v1": "GAN-based",
    "bigvgan_base_24khz_100band": "GAN-based",
    "bigvgan_v2_24khz_100band_256x": "GAN-based",
    "freev": "GAN-based",
    "rndvoc": "GAN-based",
    "vocos_mel_24khz": "Fourier / Transformer-based",
    "comvo_base": "Fourier / Transformer-based",
    "comvo_large": "Fourier / Transformer-based",
    "rfwave_libritts_24k": "Flow-based",
    "wavefm": "Flow-based",
    "flow2gan": "Flow-based",
    "bridgevoc": "Diffusion-based",
    "periodwave_turbo": "Diffusion-based",
    "periodwave_24k": "Diffusion-based",
    "griffin_lim": "Algorithmic DSP"
  },
  "arch_family_to_category": {
    "Anti-Aliased Snake GAN": "GAN-based",
    "Fourier / iSTFT ConvNeXt": "Fourier / Transformer-based",
    "Complex-Valued Fourier": "Fourier / Transformer-based",
    "Flow Matching + GAN": "Flow-based",
    "Distilled Flow Matching": "Flow-based",
    "Rectified Flow Matching": "Flow-based",
    "Diffusion / Turbo SDE": "Diffusion-based",
    "Diffusion / Full SDE": "Diffusion-based",
    "Brownian Bridge SDE": "Diffusion-based",
    "Time-domain MRF-GAN": "GAN-based",
    "Pseudo-Inverse Mel GAN": "GAN-based",
    "Random Distortion GAN": "GAN-based",
    "Algorithmic DSP Baseline": "Algorithmic DSP"
  },
  "model_os_status": {
    "hifigan_universal_v1": {
      "code_open": true,
      "ckpt_open": true
    },
    "bigvgan_base_24khz_100band": {
      "code_open": true,
      "ckpt_open": true
    },
    "bigvgan_v2_24khz_100band_256x": {
      "code_open": true,
      "ckpt_open": true
    },
    "vocos_mel_24khz": {
      "code_open": true,
      "ckpt_open": true
    },
    "rfwave_libritts_24k": {
      "code_open": true,
      "ckpt_open": true
    },
    "griffin_lim": {
      "code_open": true,
      "ckpt_open": false
    },
    "flow2gan": {
      "code_open": true,
      "ckpt_open": true
    },
    "comvo_base": {
      "code_open": true,
      "ckpt_open": true
    },
    "comvo_large": {
      "code_open": true,
      "ckpt_open": true
    },
    "wavefm": {
      "code_open": true,
      "ckpt_open": true
    },
    "rndvoc": {
      "code_open": true,
      "ckpt_open": true
    },
    "bridgevoc": {
      "code_open": true,
      "ckpt_open": true
    },
    "freev": {
      "code_open": true,
      "ckpt_open": true
    },
    "periodwave_turbo": {
      "code_open": true,
      "ckpt_open": true
    },
    "periodwave_24k": {
      "code_open": true,
      "ckpt_open": true
    }
  },
  "model_links": {
    "hifigan_universal_v1": {
      "checkpoint": "https://github.com/jik876/hifi-gan",
      "paper": "https://arxiv.org/abs/2010.05646",
      "github": "https://github.com/jik876/hifi-gan"
    },
    "bigvgan_base_24khz_100band": {
      "checkpoint": "https://huggingface.co/nvidia/bigvgan_base_24khz_100band",
      "paper": "https://arxiv.org/abs/2206.04658",
      "github": "https://github.com/NVIDIA/BigVGAN"
    },
    "bigvgan_v2_24khz_100band_256x": {
      "checkpoint": "https://huggingface.co/nvidia/bigvgan_v2_24khz_100band_256x",
      "paper": "https://arxiv.org/abs/2206.04658",
      "github": "https://github.com/NVIDIA/BigVGAN"
    },
    "vocos_mel_24khz": {
      "checkpoint": "https://huggingface.co/charactr/vocos-mel-24khz",
      "paper": "https://arxiv.org/abs/2306.00814",
      "github": "https://github.com/hubert-siuzdak/vocos"
    },
    "rfwave_libritts_24k": {
      "checkpoint": "https://github.com/RF-Wave/RFWave",
      "paper": "https://arxiv.org/abs/2406.18567",
      "github": "https://github.com/RF-Wave/RFWave"
    },
    "griffin_lim": {
      "checkpoint": "N/A (Algorithmic — no learnable parameters)",
      "paper": "https://ieeexplore.ieee.org/document/1172092",
      "github": "https://github.com/librosa/librosa"
    },
    "flow2gan": {
      "checkpoint": "https://huggingface.co/k2-fsa/Flow2GAN",
      "paper": "https://arxiv.org/abs/2405.08819",
      "github": "https://github.com/k2-fsa/lhotse"
    },
    "comvo_base": {
      "checkpoint": "https://huggingface.co/hsoh/ComVo-base",
      "paper": "https://arxiv.org/abs/2406.19794",
      "github": "https://github.com/hsoh0306/ComVo"
    },
    "comvo_large": {
      "checkpoint": "https://huggingface.co/hsoh/ComVo-large",
      "paper": "https://arxiv.org/abs/2406.19794",
      "github": "https://github.com/hsoh0306/ComVo"
    },
    "wavefm": {
      "checkpoint": "https://github.com/lucas-ma/WaveFM",
      "paper": "https://arxiv.org/abs/2406.00287",
      "github": "https://github.com/lucas-ma/WaveFM"
    },
    "rndvoc": {
      "checkpoint": "https://huggingface.co/AndongLi/RNDVoC",
      "paper": "https://arxiv.org/abs/2406.01257",
      "github": "https://github.com/AndongLi/RNDVoC"
    },
    "bridgevoc": {
      "checkpoint": "https://huggingface.co/AndongLi/BridgeVoC",
      "paper": "https://arxiv.org/abs/2406.01258",
      "github": "https://github.com/AndongLi/BridgeVoC"
    },
    "freev": {
      "checkpoint": "https://huggingface.co/Bakerbunker/FreeV_Model_Logs",
      "paper": "https://arxiv.org/abs/2405.15842",
      "github": "https://github.com/bakerbunker/FreeV"
    },
    "periodwave_turbo": {
      "checkpoint": "https://github.com/kaist-dsp/PeriodWave",
      "paper": "https://arxiv.org/abs/2408.06945",
      "github": "https://github.com/kaist-dsp/PeriodWave"
    },
    "periodwave_24k": {
      "checkpoint": "https://github.com/kaist-dsp/PeriodWave",
      "paper": "https://arxiv.org/abs/2408.06945",
      "github": "https://github.com/kaist-dsp/PeriodWave"
    }
  },
  "datasets": {
    "LJSpeech": "Clean single-speaker studio recording (Linda Johnson, ~22h)",
    "LibriTTS": "Multi-speaker audiobook, diverse speakers (test-clean + test-other)",
    "VCTK": "Multi-speaker British/Scottish regional accented speech",
    "Free_ST": "Real-world mobile microphone, everyday acoustic conditions"
  },
  "tracks": [
    "All Tracks",
    "24kHz Primary Benchmark",
    "22.05kHz Legacy Track"
  ],
  "metric_defs": {
    "PESQ": {
      "title": "PESQ — Perceptual Evaluation of Speech Quality",
      "direction": "↑ higher better",
      "description": "ITU-T P.862 Wideband. Range 1.0–4.5. Measures narrowband spectral distortion against the reference waveform."
    },
    "STOI": {
      "title": "STOI — Short-Time Objective Intelligibility",
      "direction": "↑ higher better",
      "description": "Measures short-time spectral correlation and envelope intelligibility. Range 0–1. Part of the I (Intelligibility) PRISM-V dimension."
    },
    "MCD": {
      "title": "MCD — Mel-Cepstral Distortion (dB)",
      "direction": "↓ lower better",
      "description": "Euclidean distance on 13 MFCC coefficients using dynamic time warping. Lower = closer to reference. Part of the R (Reconstruction) PRISM-V dimension."
    },
    "LSD": {
      "title": "LSD — Log-Spectral Distance (dB)",
      "direction": "↓ lower better",
      "description": "Distance on log STFT magnitude spectrum. Lower = better reconstruction. Part of the R (Reconstruction) PRISM-V dimension."
    },
    "UTMOS": {
      "title": "UTMOS — Universal Text-to-speech MOS",
      "direction": "↑ higher better",
      "description": "Neural deep MOS predictor trained on crowdsourced MTurk ratings. Range 1–5. Part of the P (Perceptual) PRISM-V dimension."
    },
    "NISQA": {
      "title": "NISQA — Neural Image and Speech Quality Assessment (TTS)",
      "direction": "↑ higher better",
      "description": "Multi-dimensional TTS naturalness predictor covering Naturalness, Coloration, Discontinuity, and Loudness. Range 1–5. Part of the P (Perceptual) PRISM-V dimension."
    },
    "ΔWER": {
      "title": "ΔWER — Word Error Rate Degradation (%)",
      "direction": "↓ lower better",
      "description": "NeMo Conformer ASR WER on synthesized output minus WER on reference. 0% = perfect content preservation. Part of the I (Intelligibility) PRISM-V dimension."
    },
    "RTF": {
      "title": "RTF — Real-Time Factor",
      "direction": "↓ lower better",
      "description": "Processing time divided by audio duration. RTF=0.01 means 100× faster than real-time. Generator-only, Edge Profiling, batch size 1, FP32. Part of the M (Model efficiency) PRISM-V dimension."
    },
    "xRT": {
      "title": "xRT — Throughput Factor (1/RTF)",
      "direction": "↑ higher better",
      "description": "Audio seconds generated per second of clock time. xRT=100 means 100× real-time. Part of the M (Model efficiency) PRISM-V dimension."
    },
    "VRAM": {
      "title": "Peak VRAM (MB)",
      "direction": "↓ lower better",
      "description": "Maximum GPU memory allocated during inference. Measured at batch size 1 under Edge Profiling. Part of the M (Model efficiency) PRISM-V dimension."
    },
    "Params": {
      "title": "Parameters (Millions)",
      "direction": "↓ lower better",
      "description": "Generator model parameter count in millions. Excludes training-only discriminators and preprocessing modules. Part of the M (Model efficiency) PRISM-V dimension."
    },
    "Score": {
      "title": "PRISM-V Score (1–100)",
      "direction": "↑ higher better",
      "description": "Composite deployment index combining five dimensions: P (Perceptual via UTMOS + NISQA), R (Reconstruction via PESQ + MCD + LSD), I (Intelligibility via STOI + ΔWER), S (Speaker via embedding similarity), M (Model Efficiency via RTF + VRAM + Params). Geometric aggregation with hardware feasibility gate under Edge Profiling. Score 100 = ideal across all dimensions; score 1 = hardware-infeasible on this profile."
    }
  },
  "column_groups": {
    "prism": {
      "label": "Rank & PRISM-V",
      "emoji": "🏆",
      "css": "col-legend-prism",
      "cols": [
        "Rank & PRISM-V ↑"
      ],
      "description": "Default composite ranking index combining model rank and PRISM-V score (1–100)."
    },
    "objective": {
      "label": "Objective Metrics",
      "emoji": "📐",
      "css": "col-legend-obj",
      "cols": [
        "PESQ ↑",
        "STOI ↑",
        "MCD ↓",
        "LSD ↓"
      ],
      "description": "Signal-based mathematical measures computed against reference waveform."
    },
    "subjective": {
      "label": "Perceptual / Subjective",
      "emoji": "👂",
      "css": "col-legend-subj",
      "cols": [
        "UTMOS ↑",
        "NISQA ↑"
      ],
      "description": "Neural predictors trained on human listening study ratings."
    },
    "performance": {
      "label": "Efficiency & Performance",
      "emoji": "⚡",
      "css": "col-legend-perf",
      "cols": [
        "RTF ↓",
        "xRT ↑",
        "VRAM (MB) ↓",
        "Params (M)"
      ],
      "description": "Throughput, latency, memory, and model size under Edge Profiling."
    },
    "robustness": {
      "label": "Robustness / Per-Dataset",
      "emoji": "🛡️",
      "css": "col-legend-rob",
      "cols": [
        "LJSpeech",
        "LibriTTS",
        "VCTK",
        "Free_ST"
      ],
      "description": "PESQ on each corpus individually — reveals cross-corpus generalisation."
    }
  },
  "family_colors": {
    "Anti-Aliased Snake GAN": "#4f46e5",
    "Fourier / iSTFT ConvNeXt": "#0891b2",
    "Complex-Valued Fourier": "#0284c7",
    "Flow Matching + GAN": "#8b5cf6",
    "Distilled Flow Matching": "#a855f7",
    "Rectified Flow Matching": "#ec4899",
    "Diffusion / Turbo SDE": "#f59e0b",
    "Diffusion / Full SDE": "#d97706",
    "Brownian Bridge SDE": "#ea580c",
    "Time-domain MRF-GAN": "#10b981",
    "Pseudo-Inverse Mel GAN": "#14b8a6",
    "Random Distortion GAN": "#84cc16",
    "Algorithmic DSP Baseline": "#9ca3af"
  },
  "arch_cat_colors": {
    "GAN-based": "#4f46e5",
    "Fourier / iSTFT": "#0891b2",
    "Flow-based": "#8b5cf6",
    "Diffusion-based": "#f59e0b",
    "Algorithmic DSP": "#9ca3af"
  },
  "phone_classes": {
    "Vowels": [
      "AA",
      "AE",
      "AH",
      "AO",
      "AW",
      "AY",
      "EH",
      "ER",
      "EY",
      "IH",
      "IY",
      "OW",
      "OY",
      "UH",
      "UW"
    ],
    "Stops / Plosives": [
      "B",
      "D",
      "G",
      "K",
      "P",
      "T"
    ],
    "Fricatives": [
      "DH",
      "F",
      "S",
      "SH",
      "TH",
      "V",
      "Z",
      "ZH"
    ],
    "Affricates": [
      "CH",
      "JH"
    ],
    "Nasals": [
      "M",
      "N",
      "NG"
    ],
    "Liquids": [
      "L",
      "R"
    ],
    "Glides": [
      "W",
      "Y"
    ]
  },
  "bibtex": "@misc{purohit2026prismv,\n  author       = {Ravindrakumar M. Purohit and Hemant A. Patil},\n  title        = {PRISM-V: A Multidimensional Evaluation of Pretrained Neural Vocoders for Speech Synthesis},\n  year         = {2026},\n  howpublished = {\\url{https://iamshreeji-copy2.github.io/open_vocoder_leaderboard/}},\n  note         = {Open neural vocoder evaluation leaderboard}\n}",
  "methodology_md": "\n## 🧪 Benchmark Protocol\n\n> **Note on Theory & Formal Formulations:**  \n> The comprehensive theoretical foundation, axiomatic mathematical formulations, and geometric scoring derivations are presented in the companion paper (see BibTeX citation). This evaluation leaderboard focuses on empirical benchmarking, model comparisons, checkpoint provenance, and interactive audio inspection.\n\n### Design Principles\n**PRISM-V** is a **training-free, zero-shot evaluation** of publicly released pretrained checkpoints.\nModels are evaluated exactly as practitioners deploy them — no fine-tuning, no cherry-picked test sets.\n\n---\n\n### The Five PRISM-V Dimensions\n\nPRISM-V evaluates **P**erceptual · **R**econstruction · **I**ntelligibility · **S**peaker · **M**odel Efficiency (Vocoders).\n\n| Dimension | Evaluation Focus | Key Empirical Measures |\n|---|---|---|\n| **P — Perceptual** | Naturalness & listening perception | UTMOS (neural MOS), NISQA-TTS naturalness |\n| **R — Reconstruction** | Waveform fidelity against reference | PESQ (wideband), MCD (cepstral), LSD (spectral) |\n| **I — Intelligibility** | Speech intelligibility & ASR content preservation | STOI (intelligibility), ΔWER (ASR degradation) |\n| **S — Speaker** | Speaker identity & acoustic consistency | Speaker embedding cosine similarity |\n| **M — Model Efficiency** | Real-world execution efficiency on edge hardware | RTF (throughput), Peak VRAM, Parameter count |\n\nThe **PRISM-V Score (1–100)** provides a holistic aggregate ranking across all five core dimensions, highlighting models that balance high acoustic fidelity with edge efficiency.\n\n---\n\n### Evaluation Corpora\n\n| Corpus | Acoustic Condition | Utterances | Notes |\n|---|---|---|---|\n| **LJSpeech** | Clean studio | 2,000 | Single speaker, minimal room acoustics |\n| **LibriTTS** | Audiobook | 2,000 | Multi-speaker, test-clean + test-other |\n| **VCTK** | Accented | 2,000 | 109 speakers, British/Scottish/Irish accents |\n| **Free_ST** | Mobile / Noisy | ~1,980 | Real-world device noise, reverb, varied SNR |\n\n---\n\n### Inference Protocol\n\n| Parameter | Specification |\n|---|---|\n| **Batch size** | 1 (deployment-realistic stream inference) |\n| **Precision** | FP32 |\n| **Device Target** | Edge Profiling |\n| **Timing** | Warmup runs + measured iterations with CUDA synchronization fences |\n| **RTF scope** | Generator-only (excludes mel-spectrogram extraction) |\n| **Seed** | Fixed deterministic seed `20260909` where supported |\n\n---\n\n### Coverage and Reliability\n\nThe PRISM-V evaluation accounts for synthesis coverage — what fraction of expected utterances were successfully generated.\nEvery synthesis failure is counted and disclosed. No utterance is silently excluded.\n\n---\n\n### Phoneme-Level Diagnostics\n\nMontreal Forced Aligner (MFA v3) alignments provide phoneme-level boundaries across evaluated utterances.\nSpectral distance, F0 pitch deviation, and boundary precision are analyzed per phonetic class:\n**Vowels, Stops, Fricatives, Affricates, Nasals, Liquids, and Glides**.\n\n---\n\n### What PRISM-V does NOT do\n\n- ❌ Re-train or fine-tune any model\n- ❌ Use unofficial community checkpoints\n- ❌ Report metrics only on successful utterances (failures counted in denominators)\n- ❌ Mix 22kHz model outputs into the 24kHz primary ranking without notation\n- ❌ Score both RTF and xRT simultaneously (they contain identical information)\n",
  "changelog_md": "\n## 📋 Release Notes & Changelog\n\n### 🚀 What's New in v1.0.1 (September 12, 2026)\n- **🎨 UI & Contrast Enhancements**: High-contrast gold, silver, and bronze rank badges with enhanced visibility across both dark and light modes.\n- **✨ Cleaner Visual Experience**: Redesigned model availability chips, streamlined citation blocks, and uncluttered layout.\n- **⚡ Performance & Stability**: Upgraded zero-latency client-side theme engine with hardened lifecycle hooks for fluid, lag-free responsiveness.\n\n---\n\n### 📜 Version History\n\n| Version | Release Date | Key Updates |\n|---|---|---|\n| **v1.0.1** | **September 12, 2026** | High-contrast UI polish, uncluttered citation cards, and client-side engine stability fixes |\n| **v1.0.0** | September 10, 2026 | Initial public release: 15 pretrained neural vocoders evaluated across 4 English corpora |\n| *v1.1.0* | Upcoming | Additional vocoder families (CodecGAN, DAC-based) and streaming inference benchmarks |\n| *v1.2.0* | Planned | Accented and multilingual speech generalization evaluation tracks |\n",
  "leaderboard": [
    {
      "model_id": "vocos_mel_24khz",
      "model_name": "Vocos",
      "architecture_family": "Fourier / iSTFT ConvNeXt",
      "arch_category": "Fourier / Transformer-based",
      "arch_tags": [
        "Fourier / Transformer-based",
        "Non-Autoregressive"
      ],
      "track": "24kHz Primary Benchmark",
      "sampling_rate_hz": 24000,
      "params_m": 13.58,
      "overall_score": 82.8,
      "pesq": 3.714,
      "stoi": 0.971,
      "mcd_db": 38.35,
      "lsd_db": 6.99,
      "utmos": 3.84,
      "nisqa": 3.91,
      "delta_wer_pct": 3.42,
      "rtf": 0.0027,
      "speedup_x": 370.4,
      "peak_vram_mb": 327.6,
      "edge_feasible": "Yes",
      "is_pareto": true,
      "checkpoint_url": "https://huggingface.co/charactr/vocos-mel-24khz",
      "paper_url": "https://arxiv.org/abs/2306.00814",
      "github_url": "https://github.com/hubert-siuzdak/vocos",
      "license": "MIT",
      "author": "Charactr Inc.",
      "year": 2023,
      "rank": 1,
      "code_open": true,
      "ckpt_open": true,
      "dataset_pesqs": {
        "LJSpeech": 3.85,
        "LibriTTS": 3.791,
        "VCTK": 3.618,
        "Free_ST": 3.597
      },
      "dataset_metrics": {
        "LJSpeech": {
          "pesq": 3.85,
          "stoi": 0.984,
          "lsd_db": 7.04,
          "mcd_db": 43.43
        },
        "LibriTTS": {
          "pesq": 3.791,
          "stoi": 0.982,
          "lsd_db": 6.96,
          "mcd_db": 42.18
        },
        "VCTK": {
          "pesq": 3.618,
          "stoi": 0.945,
          "lsd_db": 7.05,
          "mcd_db": 33.26
        },
        "Free_ST": {
          "pesq": 3.597,
          "stoi": 0.973,
          "lsd_db": 6.93,
          "mcd_db": 34.54
        }
      }
    },
    {
      "model_id": "flow2gan",
      "model_name": "Flow2GAN (4-step)",
      "architecture_family": "Flow Matching + GAN",
      "arch_category": "Flow-based",
      "arch_tags": [
        "Flow-based",
        "GAN-based",
        "Non-Autoregressive"
      ],
      "track": "24kHz Primary Benchmark",
      "sampling_rate_hz": 24000,
      "params_m": 79.08,
      "overall_score": 81.5,
      "pesq": 4.469,
      "stoi": 0.994,
      "mcd_db": 29.36,
      "lsd_db": 6.46,
      "utmos": 4.05,
      "nisqa": 4.1,
      "delta_wer_pct": 2.95,
      "rtf": 0.0833,
      "speedup_x": 12.0,
      "peak_vram_mb": 1037.3,
      "edge_feasible": "Yes",
      "is_pareto": true,
      "checkpoint_url": "https://huggingface.co/k2-fsa/Flow2GAN",
      "paper_url": "https://arxiv.org/abs/2405.08819",
      "github_url": "https://github.com/k2-fsa/lhotse",
      "license": "Apache-2.0",
      "author": "K2-FSA",
      "year": 2024,
      "rank": 2,
      "code_open": true,
      "ckpt_open": true,
      "dataset_pesqs": {
        "LJSpeech": 4.484,
        "LibriTTS": 4.466,
        "VCTK": 4.459,
        "Free_ST": 4.466
      },
      "dataset_metrics": {
        "LJSpeech": {
          "pesq": 4.484,
          "stoi": 0.998,
          "lsd_db": 6.48,
          "mcd_db": 35.29
        },
        "LibriTTS": {
          "pesq": 4.466,
          "stoi": 0.998,
          "lsd_db": 6.36,
          "mcd_db": 34.34
        },
        "VCTK": {
          "pesq": 4.459,
          "stoi": 0.983,
          "lsd_db": 6.55,
          "mcd_db": 19.1
        },
        "Free_ST": {
          "pesq": 4.466,
          "stoi": 0.997,
          "lsd_db": 6.45,
          "mcd_db": 28.7
        }
      }
    },
    {
      "model_id": "rndvoc",
      "model_name": "RNDVoC",
      "architecture_family": "Random Distortion GAN",
      "arch_category": "GAN-based",
      "arch_tags": [
        "GAN-based",
        "Non-Autoregressive"
      ],
      "track": "24kHz Primary Benchmark",
      "sampling_rate_hz": 24000,
      "params_m": 3.94,
      "overall_score": 80.7,
      "pesq": 4.188,
      "stoi": 0.985,
      "mcd_db": 38.32,
      "lsd_db": 6.54,
      "utmos": 3.88,
      "nisqa": 3.92,
      "delta_wer_pct": 3.35,
      "rtf": 0.0284,
      "speedup_x": 35.2,
      "peak_vram_mb": 1925.9,
      "edge_feasible": "Yes",
      "is_pareto": true,
      "checkpoint_url": "https://huggingface.co/AndongLi/RNDVoC",
      "paper_url": "https://arxiv.org/abs/2406.01257",
      "github_url": "https://github.com/AndongLi/RNDVoC",
      "license": "MIT",
      "author": "CAS / Li et al.",
      "year": 2024,
      "rank": 3,
      "code_open": true,
      "ckpt_open": true,
      "dataset_pesqs": {
        "LJSpeech": 4.262,
        "LibriTTS": 4.156,
        "VCTK": 4.11,
        "Free_ST": 4.223
      },
      "dataset_metrics": {
        "LJSpeech": {
          "pesq": 4.262,
          "stoi": 0.992,
          "lsd_db": 6.56,
          "mcd_db": 40.24
        },
        "LibriTTS": {
          "pesq": 4.156,
          "stoi": 0.991,
          "lsd_db": 6.52,
          "mcd_db": 46.6
        },
        "VCTK": {
          "pesq": 4.11,
          "stoi": 0.964,
          "lsd_db": 6.51,
          "mcd_db": 30.97
        },
        "Free_ST": {
          "pesq": 4.223,
          "stoi": 0.992,
          "lsd_db": 6.58,
          "mcd_db": 35.47
        }
      }
    },
    {
      "model_id": "bridgevoc",
      "model_name": "BridgeVoC",
      "architecture_family": "Brownian Bridge SDE",
      "arch_category": "Diffusion-based",
      "arch_tags": [
        "Non-Autoregressive",
        "Diffusion-based"
      ],
      "track": "24kHz Primary Benchmark",
      "sampling_rate_hz": 24000,
      "params_m": 7.89,
      "overall_score": 79.6,
      "pesq": 4.377,
      "stoi": 0.99,
      "mcd_db": 38.99,
      "lsd_db": 6.57,
      "utmos": 3.92,
      "nisqa": 3.95,
      "delta_wer_pct": 3.25,
      "rtf": 0.0839,
      "speedup_x": 11.9,
      "peak_vram_mb": 591.4,
      "edge_feasible": "Yes",
      "is_pareto": false,
      "checkpoint_url": "https://huggingface.co/AndongLi/BridgeVoC",
      "paper_url": "https://arxiv.org/abs/2406.01258",
      "github_url": "https://github.com/AndongLi/BridgeVoC",
      "license": "MIT",
      "author": "CAS / Li et al.",
      "year": 2024,
      "rank": 4,
      "code_open": true,
      "ckpt_open": true,
      "dataset_pesqs": {
        "LJSpeech": 4.428,
        "LibriTTS": 4.397,
        "VCTK": 4.368,
        "Free_ST": 4.315
      },
      "dataset_metrics": {
        "LJSpeech": {
          "pesq": 4.428,
          "stoi": 0.996,
          "lsd_db": 6.62,
          "mcd_db": 45.99
        },
        "LibriTTS": {
          "pesq": 4.397,
          "stoi": 0.994,
          "lsd_db": 6.5,
          "mcd_db": 43.12
        },
        "VCTK": {
          "pesq": 4.368,
          "stoi": 0.975,
          "lsd_db": 6.61,
          "mcd_db": 31.96
        },
        "Free_ST": {
          "pesq": 4.315,
          "stoi": 0.995,
          "lsd_db": 6.56,
          "mcd_db": 34.88
        }
      }
    },
    {
      "model_id": "comvo_base",
      "model_name": "ComVo-Base",
      "architecture_family": "Complex-Valued Fourier",
      "arch_category": "Fourier / Transformer-based",
      "arch_tags": [
        "Fourier / Transformer-based",
        "Non-Autoregressive"
      ],
      "track": "24kHz Primary Benchmark",
      "sampling_rate_hz": 24000,
      "params_m": 13.28,
      "overall_score": 78.8,
      "pesq": 3.816,
      "stoi": 0.975,
      "mcd_db": 42.43,
      "lsd_db": 7.05,
      "utmos": 3.79,
      "nisqa": 3.82,
      "delta_wer_pct": 3.65,
      "rtf": 0.0123,
      "speedup_x": 81.3,
      "peak_vram_mb": 643.4,
      "edge_feasible": "Yes",
      "is_pareto": false,
      "checkpoint_url": "https://huggingface.co/hsoh/ComVo-base",
      "paper_url": "https://arxiv.org/abs/2406.19794",
      "github_url": "https://github.com/hsoh0306/ComVo",
      "license": "Apache-2.0",
      "author": "Seoul National Univ.",
      "year": 2024,
      "rank": 5,
      "code_open": true,
      "ckpt_open": true,
      "dataset_pesqs": {
        "LJSpeech": 3.977,
        "LibriTTS": 3.774,
        "VCTK": 3.819,
        "Free_ST": 3.693
      },
      "dataset_metrics": {
        "LJSpeech": {
          "pesq": 3.977,
          "stoi": 0.987,
          "lsd_db": 7.01,
          "mcd_db": 38.79
        },
        "LibriTTS": {
          "pesq": 3.774,
          "stoi": 0.98,
          "lsd_db": 7.14,
          "mcd_db": 57.89
        },
        "VCTK": {
          "pesq": 3.819,
          "stoi": 0.953,
          "lsd_db": 7.09,
          "mcd_db": 40.45
        },
        "Free_ST": {
          "pesq": 3.693,
          "stoi": 0.98,
          "lsd_db": 6.94,
          "mcd_db": 32.59
        }
      }
    },
    {
      "model_id": "periodwave_turbo",
      "model_name": "PeriodWave-Turbo (4-step)",
      "architecture_family": "Diffusion / Turbo SDE",
      "arch_category": "Diffusion-based",
      "arch_tags": [
        "Non-Autoregressive",
        "Diffusion-based"
      ],
      "track": "24kHz Primary Benchmark",
      "sampling_rate_hz": 24000,
      "params_m": 29.81,
      "overall_score": 78.6,
      "pesq": 4.369,
      "stoi": 0.988,
      "mcd_db": 38.95,
      "lsd_db": 6.93,
      "utmos": 4.08,
      "nisqa": 4.12,
      "delta_wer_pct": 2.88,
      "rtf": 0.148,
      "speedup_x": 6.8,
      "peak_vram_mb": 2746.9,
      "edge_feasible": "Yes",
      "is_pareto": false,
      "checkpoint_url": "https://github.com/kaist-dsp/PeriodWave",
      "paper_url": "https://arxiv.org/abs/2408.06945",
      "github_url": "https://github.com/kaist-dsp/PeriodWave",
      "license": "MIT",
      "author": "KAIST",
      "year": 2024,
      "rank": 6,
      "code_open": true,
      "ckpt_open": true,
      "dataset_pesqs": {
        "LJSpeech": 4.43,
        "LibriTTS": 4.338,
        "VCTK": 4.328,
        "Free_ST": 4.379
      },
      "dataset_metrics": {
        "LJSpeech": {
          "pesq": 4.43,
          "stoi": 0.996,
          "lsd_db": 7.09,
          "mcd_db": 40.61
        },
        "LibriTTS": {
          "pesq": 4.338,
          "stoi": 0.995,
          "lsd_db": 6.79,
          "mcd_db": 40.06
        },
        "VCTK": {
          "pesq": 4.328,
          "stoi": 0.966,
          "lsd_db": 6.99,
          "mcd_db": 30.45
        },
        "Free_ST": {
          "pesq": 4.379,
          "stoi": 0.995,
          "lsd_db": 6.85,
          "mcd_db": 44.67
        }
      }
    },
    {
      "model_id": "bigvgan_v2_24khz_100band_256x",
      "model_name": "BigVGAN-v2 (112M)",
      "architecture_family": "Anti-Aliased Snake GAN",
      "arch_category": "GAN-based",
      "arch_tags": [
        "GAN-based",
        "Non-Autoregressive"
      ],
      "track": "24kHz Primary Benchmark",
      "sampling_rate_hz": 24000,
      "params_m": 112.45,
      "overall_score": 77.8,
      "pesq": 4.381,
      "stoi": 0.992,
      "mcd_db": 25.38,
      "lsd_db": 6.55,
      "utmos": 4.12,
      "nisqa": 4.18,
      "delta_wer_pct": 2.75,
      "rtf": 0.2208,
      "speedup_x": 4.5,
      "peak_vram_mb": 2719.6,
      "edge_feasible": "Yes",
      "is_pareto": false,
      "checkpoint_url": "https://huggingface.co/nvidia/bigvgan_v2_24khz_100band_256x",
      "paper_url": "https://arxiv.org/abs/2206.04658",
      "github_url": "https://github.com/NVIDIA/BigVGAN",
      "license": "MIT",
      "author": "NVIDIA",
      "year": 2024,
      "rank": 7,
      "code_open": true,
      "ckpt_open": true,
      "dataset_pesqs": {
        "LJSpeech": 4.407,
        "LibriTTS": 4.35,
        "VCTK": 4.373,
        "Free_ST": 4.395
      },
      "dataset_metrics": {
        "LJSpeech": {
          "pesq": 4.407,
          "stoi": 0.996,
          "lsd_db": 6.56,
          "mcd_db": 26.58
        },
        "LibriTTS": {
          "pesq": 4.35,
          "stoi": 0.997,
          "lsd_db": 6.48,
          "mcd_db": 27.91
        },
        "VCTK": {
          "pesq": 4.373,
          "stoi": 0.98,
          "lsd_db": 6.61,
          "mcd_db": 21.47
        },
        "Free_ST": {
          "pesq": 4.395,
          "stoi": 0.996,
          "lsd_db": 6.54,
          "mcd_db": 25.55
        }
      }
    },
    {
      "model_id": "comvo_large",
      "model_name": "ComVo-Large",
      "architecture_family": "Complex-Valued Fourier",
      "arch_category": "Fourier / Transformer-based",
      "arch_tags": [
        "Fourier / Transformer-based",
        "Non-Autoregressive"
      ],
      "track": "24kHz Primary Benchmark",
      "sampling_rate_hz": 24000,
      "params_m": 115.35,
      "overall_score": 77.6,
      "pesq": 4.03,
      "stoi": 0.984,
      "mcd_db": 31.53,
      "lsd_db": 6.84,
      "utmos": 3.96,
      "nisqa": 4.02,
      "delta_wer_pct": 3.1,
      "rtf": 0.0525,
      "speedup_x": 19.0,
      "peak_vram_mb": 1857.0,
      "edge_feasible": "Yes",
      "is_pareto": false,
      "checkpoint_url": "https://huggingface.co/hsoh/ComVo-large",
      "paper_url": "https://arxiv.org/abs/2406.19794",
      "github_url": "https://github.com/hsoh0306/ComVo",
      "license": "Apache-2.0",
      "author": "Seoul National Univ.",
      "year": 2024,
      "rank": 8,
      "code_open": true,
      "ckpt_open": true,
      "dataset_pesqs": {
        "LJSpeech": 4.106,
        "LibriTTS": 4.089,
        "VCTK": 4.02,
        "Free_ST": 3.906
      },
      "dataset_metrics": {
        "LJSpeech": {
          "pesq": 4.106,
          "stoi": 0.992,
          "lsd_db": 6.83,
          "mcd_db": 34.38
        },
        "LibriTTS": {
          "pesq": 4.089,
          "stoi": 0.99,
          "lsd_db": 6.79,
          "mcd_db": 36.09
        },
        "VCTK": {
          "pesq": 4.02,
          "stoi": 0.967,
          "lsd_db": 6.93,
          "mcd_db": 29.81
        },
        "Free_ST": {
          "pesq": 3.906,
          "stoi": 0.986,
          "lsd_db": 6.82,
          "mcd_db": 25.84
        }
      }
    },
    {
      "model_id": "griffin_lim",
      "model_name": "Griffin-Lim STFT",
      "architecture_family": "Algorithmic DSP Baseline",
      "arch_category": "Algorithmic DSP",
      "arch_tags": [
        "Algorithmic DSP"
      ],
      "track": "24kHz Primary Benchmark",
      "sampling_rate_hz": 24000,
      "params_m": 0.0,
      "overall_score": 73.7,
      "pesq": 4.014,
      "stoi": 0.995,
      "mcd_db": 17.68,
      "lsd_db": 3.01,
      "utmos": 2.15,
      "nisqa": 2.2,
      "delta_wer_pct": 8.9,
      "rtf": 0.0057,
      "speedup_x": 175.4,
      "peak_vram_mb": 686.9,
      "edge_feasible": "Yes",
      "is_pareto": true,
      "checkpoint_url": "N/A (Algorithmic — no learnable parameters)",
      "paper_url": "https://ieeexplore.ieee.org/document/1172092",
      "github_url": "https://github.com/librosa/librosa",
      "license": "Public Domain",
      "author": "Griffin & Lim",
      "year": 1984,
      "rank": 9,
      "code_open": true,
      "ckpt_open": false,
      "dataset_pesqs": {
        "LJSpeech": 4.15,
        "LibriTTS": 3.793,
        "VCTK": 3.94,
        "Free_ST": 4.173
      },
      "dataset_metrics": {
        "LJSpeech": {
          "pesq": 4.15,
          "stoi": 0.999,
          "lsd_db": 2.94,
          "mcd_db": 15.87
        },
        "LibriTTS": {
          "pesq": 3.793,
          "stoi": 0.998,
          "lsd_db": 3.2,
          "mcd_db": 21.9
        },
        "VCTK": {
          "pesq": 3.94,
          "stoi": 0.987,
          "lsd_db": 3.0,
          "mcd_db": 16.44
        },
        "Free_ST": {
          "pesq": 4.173,
          "stoi": 0.996,
          "lsd_db": 2.92,
          "mcd_db": 16.52
        }
      }
    },
    {
      "model_id": "freev",
      "model_name": "FreeV",
      "architecture_family": "Pseudo-Inverse Mel GAN",
      "arch_category": "GAN-based",
      "arch_tags": [
        "GAN-based",
        "Non-Autoregressive"
      ],
      "track": "22.05kHz Legacy Track",
      "sampling_rate_hz": 22050,
      "params_m": 18.22,
      "overall_score": 73.5,
      "pesq": 3.149,
      "stoi": 0.948,
      "mcd_db": 68.08,
      "lsd_db": 6.98,
      "utmos": 3.52,
      "nisqa": 3.58,
      "delta_wer_pct": 4.2,
      "rtf": 0.0033,
      "speedup_x": 303.0,
      "peak_vram_mb": 387.5,
      "edge_feasible": "Yes",
      "is_pareto": false,
      "checkpoint_url": "https://huggingface.co/Bakerbunker/FreeV_Model_Logs",
      "paper_url": "https://arxiv.org/abs/2405.15842",
      "github_url": "https://github.com/bakerbunker/FreeV",
      "license": "Apache-2.0",
      "author": "Baker et al.",
      "year": 2024,
      "rank": 10,
      "code_open": true,
      "ckpt_open": true,
      "dataset_pesqs": {
        "LJSpeech": 3.696,
        "LibriTTS": 3.282,
        "VCTK": 2.585,
        "Free_ST": 3.032
      },
      "dataset_metrics": {
        "LJSpeech": {
          "pesq": 3.696,
          "stoi": 0.975,
          "lsd_db": 6.82,
          "mcd_db": 65.2
        },
        "LibriTTS": {
          "pesq": 3.282,
          "stoi": 0.96,
          "lsd_db": 6.86,
          "mcd_db": 76.75
        },
        "VCTK": {
          "pesq": 2.585,
          "stoi": 0.898,
          "lsd_db": 7.16,
          "mcd_db": 65.83
        },
        "Free_ST": {
          "pesq": 3.032,
          "stoi": 0.957,
          "lsd_db": 7.09,
          "mcd_db": 64.54
        }
      }
    },
    {
      "model_id": "bigvgan_base_24khz_100band",
      "model_name": "BigVGAN-Base (14M)",
      "architecture_family": "Anti-Aliased Snake GAN",
      "arch_category": "GAN-based",
      "arch_tags": [
        "GAN-based",
        "Non-Autoregressive"
      ],
      "track": "24kHz Primary Benchmark",
      "sampling_rate_hz": 24000,
      "params_m": 14.03,
      "overall_score": 71.2,
      "pesq": 3.856,
      "stoi": 0.978,
      "mcd_db": 39.48,
      "lsd_db": 6.99,
      "utmos": 3.62,
      "nisqa": 3.68,
      "delta_wer_pct": 3.9,
      "rtf": 0.1103,
      "speedup_x": 9.1,
      "peak_vram_mb": 3094.8,
      "edge_feasible": "Yes",
      "is_pareto": false,
      "checkpoint_url": "https://huggingface.co/nvidia/bigvgan_base_24khz_100band",
      "paper_url": "https://arxiv.org/abs/2206.04658",
      "github_url": "https://github.com/NVIDIA/BigVGAN",
      "license": "MIT",
      "author": "NVIDIA",
      "year": 2022,
      "rank": 11,
      "code_open": true,
      "ckpt_open": true,
      "dataset_pesqs": {
        "LJSpeech": 4.004,
        "LibriTTS": 3.925,
        "VCTK": 3.853,
        "Free_ST": 3.641
      },
      "dataset_metrics": {
        "LJSpeech": {
          "pesq": 4.004,
          "stoi": 0.988,
          "lsd_db": 7.08,
          "mcd_db": 42.21
        },
        "LibriTTS": {
          "pesq": 3.925,
          "stoi": 0.987,
          "lsd_db": 6.9,
          "mcd_db": 42.48
        },
        "VCTK": {
          "pesq": 3.853,
          "stoi": 0.956,
          "lsd_db": 7.03,
          "mcd_db": 32.37
        },
        "Free_ST": {
          "pesq": 3.641,
          "stoi": 0.982,
          "lsd_db": 6.94,
          "mcd_db": 40.84
        }
      }
    },
    {
      "model_id": "wavefm",
      "model_name": "WaveFM (1-step)",
      "architecture_family": "Distilled Flow Matching",
      "arch_category": "Flow-based",
      "arch_tags": [
        "Flow-based",
        "Non-Autoregressive"
      ],
      "track": "24kHz Primary Benchmark",
      "sampling_rate_hz": 24000,
      "params_m": 19.53,
      "overall_score": 70.7,
      "pesq": 3.672,
      "stoi": 0.963,
      "mcd_db": 48.51,
      "lsd_db": 7.26,
      "utmos": 3.71,
      "nisqa": 3.74,
      "delta_wer_pct": 3.85,
      "rtf": 0.0709,
      "speedup_x": 14.1,
      "peak_vram_mb": 3065.6,
      "edge_feasible": "Yes",
      "is_pareto": false,
      "checkpoint_url": "https://github.com/lucas-ma/WaveFM",
      "paper_url": "https://arxiv.org/abs/2406.00287",
      "github_url": "https://github.com/lucas-ma/WaveFM",
      "license": "MIT",
      "author": "Ma et al.",
      "year": 2024,
      "rank": 12,
      "code_open": true,
      "ckpt_open": true,
      "dataset_pesqs": {
        "LJSpeech": 3.744,
        "LibriTTS": 3.679,
        "VCTK": 3.637,
        "Free_ST": 3.629
      },
      "dataset_metrics": {
        "LJSpeech": {
          "pesq": 3.744,
          "stoi": 0.977,
          "lsd_db": 7.16,
          "mcd_db": 52.88
        },
        "LibriTTS": {
          "pesq": 3.679,
          "stoi": 0.975,
          "lsd_db": 7.04,
          "mcd_db": 55.47
        },
        "VCTK": {
          "pesq": 3.637,
          "stoi": 0.926,
          "lsd_db": 7.96,
          "mcd_db": 41.15
        },
        "Free_ST": {
          "pesq": 3.629,
          "stoi": 0.976,
          "lsd_db": 6.88,
          "mcd_db": 44.52
        }
      }
    },
    {
      "model_id": "periodwave_24k",
      "model_name": "PeriodWave (30-step)",
      "architecture_family": "Diffusion / Full SDE",
      "arch_category": "Diffusion-based",
      "arch_tags": [
        "Non-Autoregressive",
        "Diffusion-based"
      ],
      "track": "24kHz Primary Benchmark",
      "sampling_rate_hz": 24000,
      "params_m": 29.81,
      "overall_score": 70.6,
      "pesq": 4.147,
      "stoi": 0.964,
      "mcd_db": 126.28,
      "lsd_db": 10.73,
      "utmos": 4.15,
      "nisqa": 4.21,
      "delta_wer_pct": 2.65,
      "rtf": 0.7693,
      "speedup_x": 1.3,
      "peak_vram_mb": 4469.1,
      "edge_feasible": "No",
      "is_pareto": false,
      "checkpoint_url": "https://github.com/kaist-dsp/PeriodWave",
      "paper_url": "https://arxiv.org/abs/2408.06945",
      "github_url": "https://github.com/kaist-dsp/PeriodWave",
      "license": "MIT",
      "author": "KAIST",
      "year": 2024,
      "rank": 13,
      "code_open": true,
      "ckpt_open": true,
      "dataset_pesqs": {
        "LJSpeech": 4.255,
        "LibriTTS": 4.159,
        "VCTK": 4.193,
        "Free_ST": 3.983
      },
      "dataset_metrics": {
        "LJSpeech": {
          "pesq": 4.255,
          "stoi": 0.989,
          "lsd_db": 9.97,
          "mcd_db": 106.28
        },
        "LibriTTS": {
          "pesq": 4.159,
          "stoi": 0.988,
          "lsd_db": 9.81,
          "mcd_db": 122.97
        },
        "VCTK": {
          "pesq": 4.193,
          "stoi": 0.899,
          "lsd_db": 10.83,
          "mcd_db": 97.39
        },
        "Free_ST": {
          "pesq": 3.983,
          "stoi": 0.981,
          "lsd_db": 12.32,
          "mcd_db": 178.46
        }
      }
    },
    {
      "model_id": "rfwave_libritts_24k",
      "model_name": "RFWave",
      "architecture_family": "Rectified Flow Matching",
      "arch_category": "Flow-based",
      "arch_tags": [
        "Flow-based",
        "Non-Autoregressive"
      ],
      "track": "24kHz Primary Benchmark",
      "sampling_rate_hz": 24000,
      "params_m": 18.27,
      "overall_score": 67.6,
      "pesq": 3.814,
      "stoi": 0.94,
      "mcd_db": 145.66,
      "lsd_db": 8.8,
      "utmos": 3.98,
      "nisqa": 4.01,
      "delta_wer_pct": 3.15,
      "rtf": 0.3752,
      "speedup_x": 2.7,
      "peak_vram_mb": 11142.9,
      "edge_feasible": "No",
      "is_pareto": false,
      "checkpoint_url": "https://github.com/RF-Wave/RFWave",
      "paper_url": "https://arxiv.org/abs/2406.18567",
      "github_url": "https://github.com/RF-Wave/RFWave",
      "license": "MIT",
      "author": "ByteDance / SJTU",
      "year": 2024,
      "rank": 14,
      "code_open": true,
      "ckpt_open": true,
      "dataset_pesqs": {
        "LJSpeech": 4.183,
        "LibriTTS": 3.954,
        "VCTK": 3.746,
        "Free_ST": 3.373
      },
      "dataset_metrics": {
        "LJSpeech": {
          "pesq": 4.183,
          "stoi": 0.988,
          "lsd_db": 8.48,
          "mcd_db": 110.45
        },
        "LibriTTS": {
          "pesq": 3.954,
          "stoi": 0.985,
          "lsd_db": 8.64,
          "mcd_db": 143.77
        },
        "VCTK": {
          "pesq": 3.746,
          "stoi": 0.823,
          "lsd_db": 9.29,
          "mcd_db": 116.1
        },
        "Free_ST": {
          "pesq": 3.373,
          "stoi": 0.963,
          "lsd_db": 8.77,
          "mcd_db": 212.31
        }
      }
    },
    {
      "model_id": "hifigan_universal_v1",
      "model_name": "HiFi-GAN (Universal V1)",
      "architecture_family": "Time-domain MRF-GAN",
      "arch_category": "GAN-based",
      "arch_tags": [
        "GAN-based",
        "Non-Autoregressive"
      ],
      "track": "22.05kHz Legacy Track",
      "sampling_rate_hz": 22050,
      "params_m": 13.94,
      "overall_score": 64.8,
      "pesq": 3.019,
      "stoi": 0.947,
      "mcd_db": 71.28,
      "lsd_db": 7.7,
      "utmos": 3.45,
      "nisqa": 3.5,
      "delta_wer_pct": 4.45,
      "rtf": 0.0287,
      "speedup_x": 34.8,
      "peak_vram_mb": 418.7,
      "edge_feasible": "Yes",
      "is_pareto": false,
      "checkpoint_url": "https://github.com/jik876/hifi-gan",
      "paper_url": "https://arxiv.org/abs/2010.05646",
      "github_url": "https://github.com/jik876/hifi-gan",
      "license": "MIT",
      "author": "Kakao Enterprise",
      "year": 2020,
      "rank": 15,
      "code_open": true,
      "ckpt_open": true,
      "dataset_pesqs": {
        "LJSpeech": 3.221,
        "LibriTTS": 3.11,
        "VCTK": 2.893,
        "Free_ST": 2.851
      },
      "dataset_metrics": {
        "LJSpeech": {
          "pesq": 3.221,
          "stoi": 0.968,
          "lsd_db": 7.82,
          "mcd_db": 80.36
        },
        "LibriTTS": {
          "pesq": 3.11,
          "stoi": 0.965,
          "lsd_db": 7.56,
          "mcd_db": 74.25
        },
        "VCTK": {
          "pesq": 2.893,
          "stoi": 0.903,
          "lsd_db": 7.62,
          "mcd_db": 64.67
        },
        "Free_ST": {
          "pesq": 2.851,
          "stoi": 0.952,
          "lsd_db": 7.79,
          "mcd_db": 65.85
        }
      }
    }
  ],
  "dataset_breakdown": [
    {
      "model_id": "bigvgan_v2_24khz_100band_256x",
      "model_name": "BigVGAN-v2 (112M)",
      "dataset": "LJSpeech",
      "pesq": 4.407,
      "stoi": 0.996,
      "lsd_db": 6.56,
      "mcd_db": 26.58
    },
    {
      "model_id": "bigvgan_base_24khz_100band",
      "model_name": "BigVGAN-Base (14M)",
      "dataset": "LJSpeech",
      "pesq": 4.004,
      "stoi": 0.988,
      "lsd_db": 7.08,
      "mcd_db": 42.21
    },
    {
      "model_id": "vocos_mel_24khz",
      "model_name": "Vocos",
      "dataset": "LJSpeech",
      "pesq": 3.85,
      "stoi": 0.984,
      "lsd_db": 7.04,
      "mcd_db": 43.43
    },
    {
      "model_id": "comvo_large",
      "model_name": "ComVo-Large",
      "dataset": "LJSpeech",
      "pesq": 4.106,
      "stoi": 0.992,
      "lsd_db": 6.83,
      "mcd_db": 34.38
    },
    {
      "model_id": "comvo_base",
      "model_name": "ComVo-Base",
      "dataset": "LJSpeech",
      "pesq": 3.977,
      "stoi": 0.987,
      "lsd_db": 7.01,
      "mcd_db": 38.79
    },
    {
      "model_id": "periodwave_turbo",
      "model_name": "PeriodWave-Turbo (4-step)",
      "dataset": "LJSpeech",
      "pesq": 4.43,
      "stoi": 0.996,
      "lsd_db": 7.09,
      "mcd_db": 40.61
    },
    {
      "model_id": "periodwave_24k",
      "model_name": "PeriodWave (30-step)",
      "dataset": "LJSpeech",
      "pesq": 4.255,
      "stoi": 0.989,
      "lsd_db": 9.97,
      "mcd_db": 106.28
    },
    {
      "model_id": "flow2gan",
      "model_name": "Flow2GAN (4-step)",
      "dataset": "LJSpeech",
      "pesq": 4.484,
      "stoi": 0.998,
      "lsd_db": 6.48,
      "mcd_db": 35.29
    },
    {
      "model_id": "bridgevoc",
      "model_name": "BridgeVoC",
      "dataset": "LJSpeech",
      "pesq": 4.428,
      "stoi": 0.996,
      "lsd_db": 6.62,
      "mcd_db": 45.99
    },
    {
      "model_id": "rfwave_libritts_24k",
      "model_name": "RFWave",
      "dataset": "LJSpeech",
      "pesq": 4.183,
      "stoi": 0.988,
      "lsd_db": 8.48,
      "mcd_db": 110.45
    },
    {
      "model_id": "wavefm",
      "model_name": "WaveFM (1-step)",
      "dataset": "LJSpeech",
      "pesq": 3.744,
      "stoi": 0.977,
      "lsd_db": 7.16,
      "mcd_db": 52.88
    },
    {
      "model_id": "rndvoc",
      "model_name": "RNDVoC",
      "dataset": "LJSpeech",
      "pesq": 4.262,
      "stoi": 0.992,
      "lsd_db": 6.56,
      "mcd_db": 40.24
    },
    {
      "model_id": "freev",
      "model_name": "FreeV",
      "dataset": "LJSpeech",
      "pesq": 3.696,
      "stoi": 0.975,
      "lsd_db": 6.82,
      "mcd_db": 65.2
    },
    {
      "model_id": "hifigan_universal_v1",
      "model_name": "HiFi-GAN (Universal V1)",
      "dataset": "LJSpeech",
      "pesq": 3.221,
      "stoi": 0.968,
      "lsd_db": 7.82,
      "mcd_db": 80.36
    },
    {
      "model_id": "griffin_lim",
      "model_name": "Griffin-Lim STFT",
      "dataset": "LJSpeech",
      "pesq": 4.15,
      "stoi": 0.999,
      "lsd_db": 2.94,
      "mcd_db": 15.87
    },
    {
      "model_id": "bigvgan_v2_24khz_100band_256x",
      "model_name": "BigVGAN-v2 (112M)",
      "dataset": "LibriTTS",
      "pesq": 4.35,
      "stoi": 0.997,
      "lsd_db": 6.48,
      "mcd_db": 27.91
    },
    {
      "model_id": "bigvgan_base_24khz_100band",
      "model_name": "BigVGAN-Base (14M)",
      "dataset": "LibriTTS",
      "pesq": 3.925,
      "stoi": 0.987,
      "lsd_db": 6.9,
      "mcd_db": 42.48
    },
    {
      "model_id": "vocos_mel_24khz",
      "model_name": "Vocos",
      "dataset": "LibriTTS",
      "pesq": 3.791,
      "stoi": 0.982,
      "lsd_db": 6.96,
      "mcd_db": 42.18
    },
    {
      "model_id": "comvo_large",
      "model_name": "ComVo-Large",
      "dataset": "LibriTTS",
      "pesq": 4.089,
      "stoi": 0.99,
      "lsd_db": 6.79,
      "mcd_db": 36.09
    },
    {
      "model_id": "comvo_base",
      "model_name": "ComVo-Base",
      "dataset": "LibriTTS",
      "pesq": 3.774,
      "stoi": 0.98,
      "lsd_db": 7.14,
      "mcd_db": 57.89
    },
    {
      "model_id": "periodwave_turbo",
      "model_name": "PeriodWave-Turbo (4-step)",
      "dataset": "LibriTTS",
      "pesq": 4.338,
      "stoi": 0.995,
      "lsd_db": 6.79,
      "mcd_db": 40.06
    },
    {
      "model_id": "periodwave_24k",
      "model_name": "PeriodWave (30-step)",
      "dataset": "LibriTTS",
      "pesq": 4.159,
      "stoi": 0.988,
      "lsd_db": 9.81,
      "mcd_db": 122.97
    },
    {
      "model_id": "flow2gan",
      "model_name": "Flow2GAN (4-step)",
      "dataset": "LibriTTS",
      "pesq": 4.466,
      "stoi": 0.998,
      "lsd_db": 6.36,
      "mcd_db": 34.34
    },
    {
      "model_id": "bridgevoc",
      "model_name": "BridgeVoC",
      "dataset": "LibriTTS",
      "pesq": 4.397,
      "stoi": 0.994,
      "lsd_db": 6.5,
      "mcd_db": 43.12
    },
    {
      "model_id": "rfwave_libritts_24k",
      "model_name": "RFWave",
      "dataset": "LibriTTS",
      "pesq": 3.954,
      "stoi": 0.985,
      "lsd_db": 8.64,
      "mcd_db": 143.77
    },
    {
      "model_id": "wavefm",
      "model_name": "WaveFM (1-step)",
      "dataset": "LibriTTS",
      "pesq": 3.679,
      "stoi": 0.975,
      "lsd_db": 7.04,
      "mcd_db": 55.47
    },
    {
      "model_id": "rndvoc",
      "model_name": "RNDVoC",
      "dataset": "LibriTTS",
      "pesq": 4.156,
      "stoi": 0.991,
      "lsd_db": 6.52,
      "mcd_db": 46.6
    },
    {
      "model_id": "freev",
      "model_name": "FreeV",
      "dataset": "LibriTTS",
      "pesq": 3.282,
      "stoi": 0.96,
      "lsd_db": 6.86,
      "mcd_db": 76.75
    },
    {
      "model_id": "hifigan_universal_v1",
      "model_name": "HiFi-GAN (Universal V1)",
      "dataset": "LibriTTS",
      "pesq": 3.11,
      "stoi": 0.965,
      "lsd_db": 7.56,
      "mcd_db": 74.25
    },
    {
      "model_id": "griffin_lim",
      "model_name": "Griffin-Lim STFT",
      "dataset": "LibriTTS",
      "pesq": 3.793,
      "stoi": 0.998,
      "lsd_db": 3.2,
      "mcd_db": 21.9
    },
    {
      "model_id": "bigvgan_v2_24khz_100band_256x",
      "model_name": "BigVGAN-v2 (112M)",
      "dataset": "VCTK",
      "pesq": 4.373,
      "stoi": 0.98,
      "lsd_db": 6.61,
      "mcd_db": 21.47
    },
    {
      "model_id": "bigvgan_base_24khz_100band",
      "model_name": "BigVGAN-Base (14M)",
      "dataset": "VCTK",
      "pesq": 3.853,
      "stoi": 0.956,
      "lsd_db": 7.03,
      "mcd_db": 32.37
    },
    {
      "model_id": "vocos_mel_24khz",
      "model_name": "Vocos",
      "dataset": "VCTK",
      "pesq": 3.618,
      "stoi": 0.945,
      "lsd_db": 7.05,
      "mcd_db": 33.26
    },
    {
      "model_id": "comvo_large",
      "model_name": "ComVo-Large",
      "dataset": "VCTK",
      "pesq": 4.02,
      "stoi": 0.967,
      "lsd_db": 6.93,
      "mcd_db": 29.81
    },
    {
      "model_id": "comvo_base",
      "model_name": "ComVo-Base",
      "dataset": "VCTK",
      "pesq": 3.819,
      "stoi": 0.953,
      "lsd_db": 7.09,
      "mcd_db": 40.45
    },
    {
      "model_id": "periodwave_turbo",
      "model_name": "PeriodWave-Turbo (4-step)",
      "dataset": "VCTK",
      "pesq": 4.328,
      "stoi": 0.966,
      "lsd_db": 6.99,
      "mcd_db": 30.45
    },
    {
      "model_id": "periodwave_24k",
      "model_name": "PeriodWave (30-step)",
      "dataset": "VCTK",
      "pesq": 4.193,
      "stoi": 0.899,
      "lsd_db": 10.83,
      "mcd_db": 97.39
    },
    {
      "model_id": "flow2gan",
      "model_name": "Flow2GAN (4-step)",
      "dataset": "VCTK",
      "pesq": 4.459,
      "stoi": 0.983,
      "lsd_db": 6.55,
      "mcd_db": 19.1
    },
    {
      "model_id": "bridgevoc",
      "model_name": "BridgeVoC",
      "dataset": "VCTK",
      "pesq": 4.368,
      "stoi": 0.975,
      "lsd_db": 6.61,
      "mcd_db": 31.96
    },
    {
      "model_id": "rfwave_libritts_24k",
      "model_name": "RFWave",
      "dataset": "VCTK",
      "pesq": 3.746,
      "stoi": 0.823,
      "lsd_db": 9.29,
      "mcd_db": 116.1
    },
    {
      "model_id": "wavefm",
      "model_name": "WaveFM (1-step)",
      "dataset": "VCTK",
      "pesq": 3.637,
      "stoi": 0.926,
      "lsd_db": 7.96,
      "mcd_db": 41.15
    },
    {
      "model_id": "rndvoc",
      "model_name": "RNDVoC",
      "dataset": "VCTK",
      "pesq": 4.11,
      "stoi": 0.964,
      "lsd_db": 6.51,
      "mcd_db": 30.97
    },
    {
      "model_id": "freev",
      "model_name": "FreeV",
      "dataset": "VCTK",
      "pesq": 2.585,
      "stoi": 0.898,
      "lsd_db": 7.16,
      "mcd_db": 65.83
    },
    {
      "model_id": "hifigan_universal_v1",
      "model_name": "HiFi-GAN (Universal V1)",
      "dataset": "VCTK",
      "pesq": 2.893,
      "stoi": 0.903,
      "lsd_db": 7.62,
      "mcd_db": 64.67
    },
    {
      "model_id": "griffin_lim",
      "model_name": "Griffin-Lim STFT",
      "dataset": "VCTK",
      "pesq": 3.94,
      "stoi": 0.987,
      "lsd_db": 3.0,
      "mcd_db": 16.44
    },
    {
      "model_id": "bigvgan_v2_24khz_100band_256x",
      "model_name": "BigVGAN-v2 (112M)",
      "dataset": "Free_ST",
      "pesq": 4.395,
      "stoi": 0.996,
      "lsd_db": 6.54,
      "mcd_db": 25.55
    },
    {
      "model_id": "bigvgan_base_24khz_100band",
      "model_name": "BigVGAN-Base (14M)",
      "dataset": "Free_ST",
      "pesq": 3.641,
      "stoi": 0.982,
      "lsd_db": 6.94,
      "mcd_db": 40.84
    },
    {
      "model_id": "vocos_mel_24khz",
      "model_name": "Vocos",
      "dataset": "Free_ST",
      "pesq": 3.597,
      "stoi": 0.973,
      "lsd_db": 6.93,
      "mcd_db": 34.54
    },
    {
      "model_id": "comvo_large",
      "model_name": "ComVo-Large",
      "dataset": "Free_ST",
      "pesq": 3.906,
      "stoi": 0.986,
      "lsd_db": 6.82,
      "mcd_db": 25.84
    },
    {
      "model_id": "comvo_base",
      "model_name": "ComVo-Base",
      "dataset": "Free_ST",
      "pesq": 3.693,
      "stoi": 0.98,
      "lsd_db": 6.94,
      "mcd_db": 32.59
    },
    {
      "model_id": "periodwave_turbo",
      "model_name": "PeriodWave-Turbo (4-step)",
      "dataset": "Free_ST",
      "pesq": 4.379,
      "stoi": 0.995,
      "lsd_db": 6.85,
      "mcd_db": 44.67
    },
    {
      "model_id": "periodwave_24k",
      "model_name": "PeriodWave (30-step)",
      "dataset": "Free_ST",
      "pesq": 3.983,
      "stoi": 0.981,
      "lsd_db": 12.32,
      "mcd_db": 178.46
    },
    {
      "model_id": "flow2gan",
      "model_name": "Flow2GAN (4-step)",
      "dataset": "Free_ST",
      "pesq": 4.466,
      "stoi": 0.997,
      "lsd_db": 6.45,
      "mcd_db": 28.7
    },
    {
      "model_id": "bridgevoc",
      "model_name": "BridgeVoC",
      "dataset": "Free_ST",
      "pesq": 4.315,
      "stoi": 0.995,
      "lsd_db": 6.56,
      "mcd_db": 34.88
    },
    {
      "model_id": "rfwave_libritts_24k",
      "model_name": "RFWave",
      "dataset": "Free_ST",
      "pesq": 3.373,
      "stoi": 0.963,
      "lsd_db": 8.77,
      "mcd_db": 212.31
    },
    {
      "model_id": "wavefm",
      "model_name": "WaveFM (1-step)",
      "dataset": "Free_ST",
      "pesq": 3.629,
      "stoi": 0.976,
      "lsd_db": 6.88,
      "mcd_db": 44.52
    },
    {
      "model_id": "rndvoc",
      "model_name": "RNDVoC",
      "dataset": "Free_ST",
      "pesq": 4.223,
      "stoi": 0.992,
      "lsd_db": 6.58,
      "mcd_db": 35.47
    },
    {
      "model_id": "freev",
      "model_name": "FreeV",
      "dataset": "Free_ST",
      "pesq": 3.032,
      "stoi": 0.957,
      "lsd_db": 7.09,
      "mcd_db": 64.54
    },
    {
      "model_id": "hifigan_universal_v1",
      "model_name": "HiFi-GAN (Universal V1)",
      "dataset": "Free_ST",
      "pesq": 2.851,
      "stoi": 0.952,
      "lsd_db": 7.79,
      "mcd_db": 65.85
    },
    {
      "model_id": "griffin_lim",
      "model_name": "Griffin-Lim STFT",
      "dataset": "Free_ST",
      "pesq": 4.173,
      "stoi": 0.996,
      "lsd_db": 2.92,
      "mcd_db": 16.52
    }
  ],
  "phoneme_diagnostics": [
    {
      "model_id": "bigvgan_v2_24khz_100band_256x",
      "model_name": "BigVGAN-v2 (112M)",
      "family": "Anti-Aliased Snake GAN",
      "phonetic_class": "Vowels",
      "lsd_db": 6.286,
      "f0_error_cents": 3.5,
      "boundary_error_db": 5.34
    },
    {
      "model_id": "bigvgan_v2_24khz_100band_256x",
      "model_name": "BigVGAN-v2 (112M)",
      "family": "Anti-Aliased Snake GAN",
      "phonetic_class": "Stops / Plosives",
      "lsd_db": 6.527,
      "f0_error_cents": 5.4,
      "boundary_error_db": 8.81
    },
    {
      "model_id": "bigvgan_v2_24khz_100band_256x",
      "model_name": "BigVGAN-v2 (112M)",
      "family": "Anti-Aliased Snake GAN",
      "phonetic_class": "Fricatives",
      "lsd_db": 6.698,
      "f0_error_cents": 0.0,
      "boundary_error_db": 8.57
    },
    {
      "model_id": "bigvgan_v2_24khz_100band_256x",
      "model_name": "BigVGAN-v2 (112M)",
      "family": "Anti-Aliased Snake GAN",
      "phonetic_class": "Affricates",
      "lsd_db": 6.778,
      "f0_error_cents": 0.0,
      "boundary_error_db": 8.68
    },
    {
      "model_id": "bigvgan_v2_24khz_100band_256x",
      "model_name": "BigVGAN-v2 (112M)",
      "family": "Anti-Aliased Snake GAN",
      "phonetic_class": "Nasals",
      "lsd_db": 6.552,
      "f0_error_cents": 4.0,
      "boundary_error_db": 6.22
    },
    {
      "model_id": "bigvgan_v2_24khz_100band_256x",
      "model_name": "BigVGAN-v2 (112M)",
      "family": "Anti-Aliased Snake GAN",
      "phonetic_class": "Liquids",
      "lsd_db": 6.362,
      "f0_error_cents": 4.0,
      "boundary_error_db": 6.04
    },
    {
      "model_id": "bigvgan_v2_24khz_100band_256x",
      "model_name": "BigVGAN-v2 (112M)",
      "family": "Anti-Aliased Snake GAN",
      "phonetic_class": "Glides",
      "lsd_db": 6.456,
      "f0_error_cents": 4.0,
      "boundary_error_db": 6.13
    },
    {
      "model_id": "bigvgan_base_24khz_100band",
      "model_name": "BigVGAN-Base (14M)",
      "family": "Anti-Aliased Snake GAN",
      "phonetic_class": "Vowels",
      "lsd_db": 7.181,
      "f0_error_cents": 4.3,
      "boundary_error_db": 6.1
    },
    {
      "model_id": "bigvgan_base_24khz_100band",
      "model_name": "BigVGAN-Base (14M)",
      "family": "Anti-Aliased Snake GAN",
      "phonetic_class": "Stops / Plosives",
      "lsd_db": 7.161,
      "f0_error_cents": 6.5,
      "boundary_error_db": 9.67
    },
    {
      "model_id": "bigvgan_base_24khz_100band",
      "model_name": "BigVGAN-Base (14M)",
      "family": "Anti-Aliased Snake GAN",
      "phonetic_class": "Fricatives",
      "lsd_db": 7.25,
      "f0_error_cents": 0.0,
      "boundary_error_db": 9.28
    },
    {
      "model_id": "bigvgan_base_24khz_100band",
      "model_name": "BigVGAN-Base (14M)",
      "family": "Anti-Aliased Snake GAN",
      "phonetic_class": "Affricates",
      "lsd_db": 7.093,
      "f0_error_cents": 0.0,
      "boundary_error_db": 9.08
    },
    {
      "model_id": "bigvgan_base_24khz_100band",
      "model_name": "BigVGAN-Base (14M)",
      "family": "Anti-Aliased Snake GAN",
      "phonetic_class": "Nasals",
      "lsd_db": 7.443,
      "f0_error_cents": 4.2,
      "boundary_error_db": 7.07
    },
    {
      "model_id": "bigvgan_base_24khz_100band",
      "model_name": "BigVGAN-Base (14M)",
      "family": "Anti-Aliased Snake GAN",
      "phonetic_class": "Liquids",
      "lsd_db": 7.411,
      "f0_error_cents": 4.2,
      "boundary_error_db": 7.04
    },
    {
      "model_id": "bigvgan_base_24khz_100band",
      "model_name": "BigVGAN-Base (14M)",
      "family": "Anti-Aliased Snake GAN",
      "phonetic_class": "Glides",
      "lsd_db": 7.503,
      "f0_error_cents": 4.2,
      "boundary_error_db": 7.13
    },
    {
      "model_id": "vocos_mel_24khz",
      "model_name": "Vocos",
      "family": "Fourier / iSTFT ConvNeXt",
      "phonetic_class": "Vowels",
      "lsd_db": 7.285,
      "f0_error_cents": 4.6,
      "boundary_error_db": 6.19
    },
    {
      "model_id": "vocos_mel_24khz",
      "model_name": "Vocos",
      "family": "Fourier / iSTFT ConvNeXt",
      "phonetic_class": "Stops / Plosives",
      "lsd_db": 7.265,
      "f0_error_cents": 6.8,
      "boundary_error_db": 9.81
    },
    {
      "model_id": "vocos_mel_24khz",
      "model_name": "Vocos",
      "family": "Fourier / iSTFT ConvNeXt",
      "phonetic_class": "Fricatives",
      "lsd_db": 7.257,
      "f0_error_cents": 0.0,
      "boundary_error_db": 9.29
    },
    {
      "model_id": "vocos_mel_24khz",
      "model_name": "Vocos",
      "family": "Fourier / iSTFT ConvNeXt",
      "phonetic_class": "Affricates",
      "lsd_db": 7.376,
      "f0_error_cents": 0.0,
      "boundary_error_db": 9.44
    },
    {
      "model_id": "vocos_mel_24khz",
      "model_name": "Vocos",
      "family": "Fourier / iSTFT ConvNeXt",
      "phonetic_class": "Nasals",
      "lsd_db": 7.521,
      "f0_error_cents": 4.4,
      "boundary_error_db": 7.14
    },
    {
      "model_id": "vocos_mel_24khz",
      "model_name": "Vocos",
      "family": "Fourier / iSTFT ConvNeXt",
      "phonetic_class": "Liquids",
      "lsd_db": 7.539,
      "f0_error_cents": 4.4,
      "boundary_error_db": 7.16
    },
    {
      "model_id": "vocos_mel_24khz",
      "model_name": "Vocos",
      "family": "Fourier / iSTFT ConvNeXt",
      "phonetic_class": "Glides",
      "lsd_db": 7.364,
      "f0_error_cents": 4.4,
      "boundary_error_db": 7.0
    },
    {
      "model_id": "comvo_large",
      "model_name": "ComVo-Large",
      "family": "Complex-Valued Fourier",
      "phonetic_class": "Vowels",
      "lsd_db": 7.026,
      "f0_error_cents": 3.9,
      "boundary_error_db": 5.97
    },
    {
      "model_id": "comvo_large",
      "model_name": "ComVo-Large",
      "family": "Complex-Valued Fourier",
      "phonetic_class": "Stops / Plosives",
      "lsd_db": 7.1,
      "f0_error_cents": 6.1,
      "boundary_error_db": 9.59
    },
    {
      "model_id": "comvo_large",
      "model_name": "ComVo-Large",
      "family": "Complex-Valued Fourier",
      "phonetic_class": "Fricatives",
      "lsd_db": 7.073,
      "f0_error_cents": 0.0,
      "boundary_error_db": 9.05
    },
    {
      "model_id": "comvo_large",
      "model_name": "ComVo-Large",
      "family": "Complex-Valued Fourier",
      "phonetic_class": "Affricates",
      "lsd_db": 7.028,
      "f0_error_cents": 0.0,
      "boundary_error_db": 9.0
    },
    {
      "model_id": "comvo_large",
      "model_name": "ComVo-Large",
      "family": "Complex-Valued Fourier",
      "phonetic_class": "Nasals",
      "lsd_db": 7.402,
      "f0_error_cents": 4.0,
      "boundary_error_db": 7.03
    },
    {
      "model_id": "comvo_large",
      "model_name": "ComVo-Large",
      "family": "Complex-Valued Fourier",
      "phonetic_class": "Liquids",
      "lsd_db": 7.447,
      "f0_error_cents": 4.0,
      "boundary_error_db": 7.07
    },
    {
      "model_id": "comvo_large",
      "model_name": "ComVo-Large",
      "family": "Complex-Valued Fourier",
      "phonetic_class": "Glides",
      "lsd_db": 7.369,
      "f0_error_cents": 4.0,
      "boundary_error_db": 7.0
    },
    {
      "model_id": "comvo_base",
      "model_name": "ComVo-Base",
      "family": "Complex-Valued Fourier",
      "phonetic_class": "Vowels",
      "lsd_db": 7.246,
      "f0_error_cents": 4.4,
      "boundary_error_db": 6.16
    },
    {
      "model_id": "comvo_base",
      "model_name": "ComVo-Base",
      "family": "Complex-Valued Fourier",
      "phonetic_class": "Stops / Plosives",
      "lsd_db": 7.168,
      "f0_error_cents": 6.6,
      "boundary_error_db": 9.68
    },
    {
      "model_id": "comvo_base",
      "model_name": "ComVo-Base",
      "family": "Complex-Valued Fourier",
      "phonetic_class": "Fricatives",
      "lsd_db": 7.197,
      "f0_error_cents": 0.0,
      "boundary_error_db": 9.21
    },
    {
      "model_id": "comvo_base",
      "model_name": "ComVo-Base",
      "family": "Complex-Valued Fourier",
      "phonetic_class": "Affricates",
      "lsd_db": 7.014,
      "f0_error_cents": 0.0,
      "boundary_error_db": 8.98
    },
    {
      "model_id": "comvo_base",
      "model_name": "ComVo-Base",
      "family": "Complex-Valued Fourier",
      "phonetic_class": "Nasals",
      "lsd_db": 7.627,
      "f0_error_cents": 4.3,
      "boundary_error_db": 7.25
    },
    {
      "model_id": "comvo_base",
      "model_name": "ComVo-Base",
      "family": "Complex-Valued Fourier",
      "phonetic_class": "Liquids",
      "lsd_db": 7.593,
      "f0_error_cents": 4.3,
      "boundary_error_db": 7.21
    },
    {
      "model_id": "comvo_base",
      "model_name": "ComVo-Base",
      "family": "Complex-Valued Fourier",
      "phonetic_class": "Glides",
      "lsd_db": 7.341,
      "f0_error_cents": 4.3,
      "boundary_error_db": 6.97
    },
    {
      "model_id": "periodwave_turbo",
      "model_name": "PeriodWave-Turbo (4-step)",
      "family": "Diffusion / Turbo SDE",
      "phonetic_class": "Vowels",
      "lsd_db": 6.751,
      "f0_error_cents": 3.5,
      "boundary_error_db": 5.74
    },
    {
      "model_id": "periodwave_turbo",
      "model_name": "PeriodWave-Turbo (4-step)",
      "family": "Diffusion / Turbo SDE",
      "phonetic_class": "Stops / Plosives",
      "lsd_db": 6.988,
      "f0_error_cents": 5.4,
      "boundary_error_db": 9.43
    },
    {
      "model_id": "periodwave_turbo",
      "model_name": "PeriodWave-Turbo (4-step)",
      "family": "Diffusion / Turbo SDE",
      "phonetic_class": "Fricatives",
      "lsd_db": 7.109,
      "f0_error_cents": 0.0,
      "boundary_error_db": 9.1
    },
    {
      "model_id": "periodwave_turbo",
      "model_name": "PeriodWave-Turbo (4-step)",
      "family": "Diffusion / Turbo SDE",
      "phonetic_class": "Affricates",
      "lsd_db": 7.078,
      "f0_error_cents": 0.0,
      "boundary_error_db": 9.06
    },
    {
      "model_id": "periodwave_turbo",
      "model_name": "PeriodWave-Turbo (4-step)",
      "family": "Diffusion / Turbo SDE",
      "phonetic_class": "Nasals",
      "lsd_db": 7.027,
      "f0_error_cents": 4.0,
      "boundary_error_db": 6.68
    },
    {
      "model_id": "periodwave_turbo",
      "model_name": "PeriodWave-Turbo (4-step)",
      "family": "Diffusion / Turbo SDE",
      "phonetic_class": "Liquids",
      "lsd_db": 6.897,
      "f0_error_cents": 4.0,
      "boundary_error_db": 6.55
    },
    {
      "model_id": "periodwave_turbo",
      "model_name": "PeriodWave-Turbo (4-step)",
      "family": "Diffusion / Turbo SDE",
      "phonetic_class": "Glides",
      "lsd_db": 6.81,
      "f0_error_cents": 4.0,
      "boundary_error_db": 6.47
    },
    {
      "model_id": "periodwave_24k",
      "model_name": "PeriodWave (30-step)",
      "family": "Diffusion / Full SDE",
      "phonetic_class": "Vowels",
      "lsd_db": 8.625,
      "f0_error_cents": 3.7,
      "boundary_error_db": 7.33
    },
    {
      "model_id": "periodwave_24k",
      "model_name": "PeriodWave (30-step)",
      "family": "Diffusion / Full SDE",
      "phonetic_class": "Stops / Plosives",
      "lsd_db": 9.304,
      "f0_error_cents": 5.9,
      "boundary_error_db": 12.56
    },
    {
      "model_id": "periodwave_24k",
      "model_name": "PeriodWave (30-step)",
      "family": "Diffusion / Full SDE",
      "phonetic_class": "Fricatives",
      "lsd_db": 8.594,
      "f0_error_cents": 0.0,
      "boundary_error_db": 11.0
    },
    {
      "model_id": "periodwave_24k",
      "model_name": "PeriodWave (30-step)",
      "family": "Diffusion / Full SDE",
      "phonetic_class": "Affricates",
      "lsd_db": 8.145,
      "f0_error_cents": 0.0,
      "boundary_error_db": 10.43
    },
    {
      "model_id": "periodwave_24k",
      "model_name": "PeriodWave (30-step)",
      "family": "Diffusion / Full SDE",
      "phonetic_class": "Nasals",
      "lsd_db": 9.546,
      "f0_error_cents": 4.0,
      "boundary_error_db": 9.07
    },
    {
      "model_id": "periodwave_24k",
      "model_name": "PeriodWave (30-step)",
      "family": "Diffusion / Full SDE",
      "phonetic_class": "Liquids",
      "lsd_db": 9.122,
      "f0_error_cents": 4.0,
      "boundary_error_db": 8.67
    },
    {
      "model_id": "periodwave_24k",
      "model_name": "PeriodWave (30-step)",
      "family": "Diffusion / Full SDE",
      "phonetic_class": "Glides",
      "lsd_db": 9.793,
      "f0_error_cents": 4.0,
      "boundary_error_db": 9.3
    },
    {
      "model_id": "flow2gan",
      "model_name": "Flow2GAN (4-step)",
      "family": "Flow Matching + GAN",
      "phonetic_class": "Vowels",
      "lsd_db": 6.025,
      "f0_error_cents": 3.5,
      "boundary_error_db": 5.12
    },
    {
      "model_id": "flow2gan",
      "model_name": "Flow2GAN (4-step)",
      "family": "Flow Matching + GAN",
      "phonetic_class": "Stops / Plosives",
      "lsd_db": 6.26,
      "f0_error_cents": 5.2,
      "boundary_error_db": 8.45
    },
    {
      "model_id": "flow2gan",
      "model_name": "Flow2GAN (4-step)",
      "family": "Flow Matching + GAN",
      "phonetic_class": "Fricatives",
      "lsd_db": 6.486,
      "f0_error_cents": 0.0,
      "boundary_error_db": 8.3
    },
    {
      "model_id": "flow2gan",
      "model_name": "Flow2GAN (4-step)",
      "family": "Flow Matching + GAN",
      "phonetic_class": "Affricates",
      "lsd_db": 6.492,
      "f0_error_cents": 0.0,
      "boundary_error_db": 8.31
    },
    {
      "model_id": "flow2gan",
      "model_name": "Flow2GAN (4-step)",
      "family": "Flow Matching + GAN",
      "phonetic_class": "Nasals",
      "lsd_db": 6.24,
      "f0_error_cents": 4.0,
      "boundary_error_db": 5.93
    },
    {
      "model_id": "flow2gan",
      "model_name": "Flow2GAN (4-step)",
      "family": "Flow Matching + GAN",
      "phonetic_class": "Liquids",
      "lsd_db": 6.151,
      "f0_error_cents": 4.0,
      "boundary_error_db": 5.84
    },
    {
      "model_id": "flow2gan",
      "model_name": "Flow2GAN (4-step)",
      "family": "Flow Matching + GAN",
      "phonetic_class": "Glides",
      "lsd_db": 5.75,
      "f0_error_cents": 4.0,
      "boundary_error_db": 5.46
    },
    {
      "model_id": "bridgevoc",
      "model_name": "BridgeVoC",
      "family": "Brownian Bridge SDE",
      "phonetic_class": "Vowels",
      "lsd_db": 6.542,
      "f0_error_cents": 3.5,
      "boundary_error_db": 5.56
    },
    {
      "model_id": "bridgevoc",
      "model_name": "BridgeVoC",
      "family": "Brownian Bridge SDE",
      "phonetic_class": "Stops / Plosives",
      "lsd_db": 6.633,
      "f0_error_cents": 5.4,
      "boundary_error_db": 8.95
    },
    {
      "model_id": "bridgevoc",
      "model_name": "BridgeVoC",
      "family": "Brownian Bridge SDE",
      "phonetic_class": "Fricatives",
      "lsd_db": 6.895,
      "f0_error_cents": 0.0,
      "boundary_error_db": 8.83
    },
    {
      "model_id": "bridgevoc",
      "model_name": "BridgeVoC",
      "family": "Brownian Bridge SDE",
      "phonetic_class": "Affricates",
      "lsd_db": 6.851,
      "f0_error_cents": 0.0,
      "boundary_error_db": 8.77
    },
    {
      "model_id": "bridgevoc",
      "model_name": "BridgeVoC",
      "family": "Brownian Bridge SDE",
      "phonetic_class": "Nasals",
      "lsd_db": 6.877,
      "f0_error_cents": 4.0,
      "boundary_error_db": 6.53
    },
    {
      "model_id": "bridgevoc",
      "model_name": "BridgeVoC",
      "family": "Brownian Bridge SDE",
      "phonetic_class": "Liquids",
      "lsd_db": 6.792,
      "f0_error_cents": 4.0,
      "boundary_error_db": 6.45
    },
    {
      "model_id": "bridgevoc",
      "model_name": "BridgeVoC",
      "family": "Brownian Bridge SDE",
      "phonetic_class": "Glides",
      "lsd_db": 6.594,
      "f0_error_cents": 4.0,
      "boundary_error_db": 6.26
    },
    {
      "model_id": "rfwave_libritts_24k",
      "model_name": "RFWave",
      "family": "Rectified Flow Matching",
      "phonetic_class": "Vowels",
      "lsd_db": 7.99,
      "f0_error_cents": 4.4,
      "boundary_error_db": 6.79
    },
    {
      "model_id": "rfwave_libritts_24k",
      "model_name": "RFWave",
      "family": "Rectified Flow Matching",
      "phonetic_class": "Stops / Plosives",
      "lsd_db": 8.176,
      "f0_error_cents": 6.6,
      "boundary_error_db": 11.04
    },
    {
      "model_id": "rfwave_libritts_24k",
      "model_name": "RFWave",
      "family": "Rectified Flow Matching",
      "phonetic_class": "Fricatives",
      "lsd_db": 8.146,
      "f0_error_cents": 0.0,
      "boundary_error_db": 10.43
    },
    {
      "model_id": "rfwave_libritts_24k",
      "model_name": "RFWave",
      "family": "Rectified Flow Matching",
      "phonetic_class": "Affricates",
      "lsd_db": 7.673,
      "f0_error_cents": 0.0,
      "boundary_error_db": 9.82
    },
    {
      "model_id": "rfwave_libritts_24k",
      "model_name": "RFWave",
      "family": "Rectified Flow Matching",
      "phonetic_class": "Nasals",
      "lsd_db": 8.638,
      "f0_error_cents": 4.3,
      "boundary_error_db": 8.21
    },
    {
      "model_id": "rfwave_libritts_24k",
      "model_name": "RFWave",
      "family": "Rectified Flow Matching",
      "phonetic_class": "Liquids",
      "lsd_db": 8.529,
      "f0_error_cents": 4.3,
      "boundary_error_db": 8.1
    },
    {
      "model_id": "rfwave_libritts_24k",
      "model_name": "RFWave",
      "family": "Rectified Flow Matching",
      "phonetic_class": "Glides",
      "lsd_db": 8.333,
      "f0_error_cents": 4.3,
      "boundary_error_db": 7.92
    },
    {
      "model_id": "wavefm",
      "model_name": "WaveFM (1-step)",
      "family": "Distilled Flow Matching",
      "phonetic_class": "Vowels",
      "lsd_db": 7.494,
      "f0_error_cents": 4.7,
      "boundary_error_db": 6.37
    },
    {
      "model_id": "wavefm",
      "model_name": "WaveFM (1-step)",
      "family": "Distilled Flow Matching",
      "phonetic_class": "Stops / Plosives",
      "lsd_db": 7.132,
      "f0_error_cents": 6.9,
      "boundary_error_db": 9.63
    },
    {
      "model_id": "wavefm",
      "model_name": "WaveFM (1-step)",
      "family": "Distilled Flow Matching",
      "phonetic_class": "Fricatives",
      "lsd_db": 7.223,
      "f0_error_cents": 0.0,
      "boundary_error_db": 9.25
    },
    {
      "model_id": "wavefm",
      "model_name": "WaveFM (1-step)",
      "family": "Distilled Flow Matching",
      "phonetic_class": "Affricates",
      "lsd_db": 7.294,
      "f0_error_cents": 0.0,
      "boundary_error_db": 9.34
    },
    {
      "model_id": "wavefm",
      "model_name": "WaveFM (1-step)",
      "family": "Distilled Flow Matching",
      "phonetic_class": "Nasals",
      "lsd_db": 7.525,
      "f0_error_cents": 4.5,
      "boundary_error_db": 7.15
    },
    {
      "model_id": "wavefm",
      "model_name": "WaveFM (1-step)",
      "family": "Distilled Flow Matching",
      "phonetic_class": "Liquids",
      "lsd_db": 7.589,
      "f0_error_cents": 4.5,
      "boundary_error_db": 7.21
    },
    {
      "model_id": "wavefm",
      "model_name": "WaveFM (1-step)",
      "family": "Distilled Flow Matching",
      "phonetic_class": "Glides",
      "lsd_db": 7.066,
      "f0_error_cents": 4.5,
      "boundary_error_db": 6.71
    },
    {
      "model_id": "rndvoc",
      "model_name": "RNDVoC",
      "family": "Random Distortion GAN",
      "phonetic_class": "Vowels",
      "lsd_db": 6.674,
      "f0_error_cents": 3.6,
      "boundary_error_db": 5.67
    },
    {
      "model_id": "rndvoc",
      "model_name": "RNDVoC",
      "family": "Random Distortion GAN",
      "phonetic_class": "Stops / Plosives",
      "lsd_db": 6.873,
      "f0_error_cents": 5.8,
      "boundary_error_db": 9.28
    },
    {
      "model_id": "rndvoc",
      "model_name": "RNDVoC",
      "family": "Random Distortion GAN",
      "phonetic_class": "Fricatives",
      "lsd_db": 6.864,
      "f0_error_cents": 0.0,
      "boundary_error_db": 8.79
    },
    {
      "model_id": "rndvoc",
      "model_name": "RNDVoC",
      "family": "Random Distortion GAN",
      "phonetic_class": "Affricates",
      "lsd_db": 6.834,
      "f0_error_cents": 0.0,
      "boundary_error_db": 8.75
    },
    {
      "model_id": "rndvoc",
      "model_name": "RNDVoC",
      "family": "Random Distortion GAN",
      "phonetic_class": "Nasals",
      "lsd_db": 7.156,
      "f0_error_cents": 4.0,
      "boundary_error_db": 6.8
    },
    {
      "model_id": "rndvoc",
      "model_name": "RNDVoC",
      "family": "Random Distortion GAN",
      "phonetic_class": "Liquids",
      "lsd_db": 6.962,
      "f0_error_cents": 4.0,
      "boundary_error_db": 6.61
    },
    {
      "model_id": "rndvoc",
      "model_name": "RNDVoC",
      "family": "Random Distortion GAN",
      "phonetic_class": "Glides",
      "lsd_db": 6.789,
      "f0_error_cents": 4.0,
      "boundary_error_db": 6.45
    },
    {
      "model_id": "freev",
      "model_name": "FreeV",
      "family": "Pseudo-Inverse Mel GAN",
      "phonetic_class": "Vowels",
      "lsd_db": 7.395,
      "f0_error_cents": 5.7,
      "boundary_error_db": 6.29
    },
    {
      "model_id": "freev",
      "model_name": "FreeV",
      "family": "Pseudo-Inverse Mel GAN",
      "phonetic_class": "Stops / Plosives",
      "lsd_db": 7.582,
      "f0_error_cents": 8.1,
      "boundary_error_db": 10.24
    },
    {
      "model_id": "freev",
      "model_name": "FreeV",
      "family": "Pseudo-Inverse Mel GAN",
      "phonetic_class": "Fricatives",
      "lsd_db": 7.479,
      "f0_error_cents": 0.0,
      "boundary_error_db": 9.57
    },
    {
      "model_id": "freev",
      "model_name": "FreeV",
      "family": "Pseudo-Inverse Mel GAN",
      "phonetic_class": "Affricates",
      "lsd_db": 7.365,
      "f0_error_cents": 0.0,
      "boundary_error_db": 9.43
    },
    {
      "model_id": "freev",
      "model_name": "FreeV",
      "family": "Pseudo-Inverse Mel GAN",
      "phonetic_class": "Nasals",
      "lsd_db": 7.701,
      "f0_error_cents": 5.3,
      "boundary_error_db": 7.32
    },
    {
      "model_id": "freev",
      "model_name": "FreeV",
      "family": "Pseudo-Inverse Mel GAN",
      "phonetic_class": "Liquids",
      "lsd_db": 7.719,
      "f0_error_cents": 5.3,
      "boundary_error_db": 7.33
    },
    {
      "model_id": "freev",
      "model_name": "FreeV",
      "family": "Pseudo-Inverse Mel GAN",
      "phonetic_class": "Glides",
      "lsd_db": 7.755,
      "f0_error_cents": 5.3,
      "boundary_error_db": 7.37
    },
    {
      "model_id": "hifigan_universal_v1",
      "model_name": "HiFi-GAN (Universal V1)",
      "family": "Time-domain MRF-GAN",
      "phonetic_class": "Vowels",
      "lsd_db": 7.888,
      "f0_error_cents": 6.0,
      "boundary_error_db": 6.7
    },
    {
      "model_id": "hifigan_universal_v1",
      "model_name": "HiFi-GAN (Universal V1)",
      "family": "Time-domain MRF-GAN",
      "phonetic_class": "Stops / Plosives",
      "lsd_db": 7.822,
      "f0_error_cents": 8.4,
      "boundary_error_db": 10.56
    },
    {
      "model_id": "hifigan_universal_v1",
      "model_name": "HiFi-GAN (Universal V1)",
      "family": "Time-domain MRF-GAN",
      "phonetic_class": "Fricatives",
      "lsd_db": 7.756,
      "f0_error_cents": 0.0,
      "boundary_error_db": 9.93
    },
    {
      "model_id": "hifigan_universal_v1",
      "model_name": "HiFi-GAN (Universal V1)",
      "family": "Time-domain MRF-GAN",
      "phonetic_class": "Affricates",
      "lsd_db": 7.679,
      "f0_error_cents": 0.0,
      "boundary_error_db": 9.83
    },
    {
      "model_id": "hifigan_universal_v1",
      "model_name": "HiFi-GAN (Universal V1)",
      "family": "Time-domain MRF-GAN",
      "phonetic_class": "Nasals",
      "lsd_db": 8.05,
      "f0_error_cents": 5.5,
      "boundary_error_db": 7.65
    },
    {
      "model_id": "hifigan_universal_v1",
      "model_name": "HiFi-GAN (Universal V1)",
      "family": "Time-domain MRF-GAN",
      "phonetic_class": "Liquids",
      "lsd_db": 8.106,
      "f0_error_cents": 5.5,
      "boundary_error_db": 7.7
    },
    {
      "model_id": "hifigan_universal_v1",
      "model_name": "HiFi-GAN (Universal V1)",
      "family": "Time-domain MRF-GAN",
      "phonetic_class": "Glides",
      "lsd_db": 7.77,
      "f0_error_cents": 5.5,
      "boundary_error_db": 7.38
    },
    {
      "model_id": "griffin_lim",
      "model_name": "Griffin-Lim STFT",
      "family": "Algorithmic DSP Baseline",
      "phonetic_class": "Vowels",
      "lsd_db": 4.538,
      "f0_error_cents": 4.0,
      "boundary_error_db": 3.86
    },
    {
      "model_id": "griffin_lim",
      "model_name": "Griffin-Lim STFT",
      "family": "Algorithmic DSP Baseline",
      "phonetic_class": "Stops / Plosives",
      "lsd_db": 4.76,
      "f0_error_cents": 6.2,
      "boundary_error_db": 6.43
    },
    {
      "model_id": "griffin_lim",
      "model_name": "Griffin-Lim STFT",
      "family": "Algorithmic DSP Baseline",
      "phonetic_class": "Fricatives",
      "lsd_db": 4.171,
      "f0_error_cents": 0.0,
      "boundary_error_db": 5.34
    },
    {
      "model_id": "griffin_lim",
      "model_name": "Griffin-Lim STFT",
      "family": "Algorithmic DSP Baseline",
      "phonetic_class": "Affricates",
      "lsd_db": 4.093,
      "f0_error_cents": 0.0,
      "boundary_error_db": 5.24
    },
    {
      "model_id": "griffin_lim",
      "model_name": "Griffin-Lim STFT",
      "family": "Algorithmic DSP Baseline",
      "phonetic_class": "Nasals",
      "lsd_db": 5.511,
      "f0_error_cents": 4.0,
      "boundary_error_db": 5.24
    },
    {
      "model_id": "griffin_lim",
      "model_name": "Griffin-Lim STFT",
      "family": "Algorithmic DSP Baseline",
      "phonetic_class": "Liquids",
      "lsd_db": 5.082,
      "f0_error_cents": 4.0,
      "boundary_error_db": 4.83
    },
    {
      "model_id": "griffin_lim",
      "model_name": "Griffin-Lim STFT",
      "family": "Algorithmic DSP Baseline",
      "phonetic_class": "Glides",
      "lsd_db": 5.232,
      "f0_error_cents": 4.0,
      "boundary_error_db": 4.97
    }
  ],
  "arena_manifest": [
    {
      "tag": "clean_reading_ljspeech",
      "dataset": "LJSpeech",
      "filename": "LJ001-0009.wav",
      "description": "LJSpeech: Clean single-speaker studio reading (\"Printing then for our purpose...\")",
      "ref_audio": "assets/audio_samples/clean_reading_ljspeech/ground_truth.wav",
      "models": {
        "bigvgan_v2_24khz_100band_256x": "assets/audio_samples/clean_reading_ljspeech/bigvgan_v2_24khz_100band_256x.wav",
        "bigvgan_base_24khz_100band": "assets/audio_samples/clean_reading_ljspeech/bigvgan_base_24khz_100band.wav",
        "vocos_mel_24khz": "assets/audio_samples/clean_reading_ljspeech/vocos_mel_24khz.wav",
        "comvo_large": "assets/audio_samples/clean_reading_ljspeech/comvo_large.wav",
        "comvo_base": "assets/audio_samples/clean_reading_ljspeech/comvo_base.wav",
        "periodwave_turbo": "assets/audio_samples/clean_reading_ljspeech/periodwave_turbo.wav",
        "periodwave_24k": "assets/audio_samples/clean_reading_ljspeech/periodwave_24k.wav",
        "flow2gan": "assets/audio_samples/clean_reading_ljspeech/flow2gan.wav",
        "bridgevoc": "assets/audio_samples/clean_reading_ljspeech/bridgevoc.wav",
        "rfwave_libritts_24k": "assets/audio_samples/clean_reading_ljspeech/rfwave_libritts_24k.wav",
        "wavefm": "assets/audio_samples/clean_reading_ljspeech/wavefm.wav",
        "rndvoc": "assets/audio_samples/clean_reading_ljspeech/rndvoc.wav",
        "freev": "assets/audio_samples/clean_reading_ljspeech/freev.wav",
        "hifigan_universal_v1": "assets/audio_samples/clean_reading_ljspeech/hifigan_universal_v1.wav",
        "griffin_lim": "assets/audio_samples/clean_reading_ljspeech/griffin_lim.wav"
      }
    },
    {
      "tag": "multispeaker_libritts",
      "dataset": "LibriTTS",
      "filename": "100_121669_000005_000002.wav",
      "description": "LibriTTS: Multi-speaker narrative audio-book (\"Tom did not like to steal...\")",
      "ref_audio": "assets/audio_samples/multispeaker_libritts/ground_truth.wav",
      "models": {
        "bigvgan_v2_24khz_100band_256x": "assets/audio_samples/multispeaker_libritts/bigvgan_v2_24khz_100band_256x.wav",
        "bigvgan_base_24khz_100band": "assets/audio_samples/multispeaker_libritts/bigvgan_base_24khz_100band.wav",
        "vocos_mel_24khz": "assets/audio_samples/multispeaker_libritts/vocos_mel_24khz.wav",
        "comvo_large": "assets/audio_samples/multispeaker_libritts/comvo_large.wav",
        "comvo_base": "assets/audio_samples/multispeaker_libritts/comvo_base.wav",
        "periodwave_turbo": "assets/audio_samples/multispeaker_libritts/periodwave_turbo.wav",
        "periodwave_24k": "assets/audio_samples/multispeaker_libritts/periodwave_24k.wav",
        "flow2gan": "assets/audio_samples/multispeaker_libritts/flow2gan.wav",
        "bridgevoc": "assets/audio_samples/multispeaker_libritts/bridgevoc.wav",
        "rfwave_libritts_24k": "assets/audio_samples/multispeaker_libritts/rfwave_libritts_24k.wav",
        "wavefm": "assets/audio_samples/multispeaker_libritts/wavefm.wav",
        "rndvoc": "assets/audio_samples/multispeaker_libritts/rndvoc.wav",
        "freev": "assets/audio_samples/multispeaker_libritts/freev.wav",
        "hifigan_universal_v1": "assets/audio_samples/multispeaker_libritts/hifigan_universal_v1.wav",
        "griffin_lim": "assets/audio_samples/multispeaker_libritts/griffin_lim.wav"
      }
    },
    {
      "tag": "accented_vctk",
      "dataset": "VCTK",
      "filename": "p225_039.wav",
      "description": "VCTK: Regional Scottish/British accented speech (\"However, the decision has been welcomed...\")",
      "ref_audio": "assets/audio_samples/accented_vctk/ground_truth.wav",
      "models": {
        "bigvgan_v2_24khz_100band_256x": "assets/audio_samples/accented_vctk/bigvgan_v2_24khz_100band_256x.wav",
        "bigvgan_base_24khz_100band": "assets/audio_samples/accented_vctk/bigvgan_base_24khz_100band.wav",
        "vocos_mel_24khz": "assets/audio_samples/accented_vctk/vocos_mel_24khz.wav",
        "comvo_large": "assets/audio_samples/accented_vctk/comvo_large.wav",
        "comvo_base": "assets/audio_samples/accented_vctk/comvo_base.wav",
        "periodwave_turbo": "assets/audio_samples/accented_vctk/periodwave_turbo.wav",
        "periodwave_24k": "assets/audio_samples/accented_vctk/periodwave_24k.wav",
        "flow2gan": "assets/audio_samples/accented_vctk/flow2gan.wav",
        "bridgevoc": "assets/audio_samples/accented_vctk/bridgevoc.wav",
        "rfwave_libritts_24k": "assets/audio_samples/accented_vctk/rfwave_libritts_24k.wav",
        "wavefm": "assets/audio_samples/accented_vctk/wavefm.wav",
        "rndvoc": "assets/audio_samples/accented_vctk/rndvoc.wav",
        "freev": "assets/audio_samples/accented_vctk/freev.wav",
        "hifigan_universal_v1": "assets/audio_samples/accented_vctk/hifigan_universal_v1.wav",
        "griffin_lim": "assets/audio_samples/accented_vctk/griffin_lim.wav"
      }
    },
    {
      "tag": "device_noisy_freest",
      "dataset": "Free_ST",
      "filename": "f0001_us_f0001_00011.wav",
      "description": "Free_ST: Real-world mobile microphone acoustic condition (\"Which is right next to the sun...\")",
      "ref_audio": "assets/audio_samples/device_noisy_freest/ground_truth.wav",
      "models": {
        "bigvgan_v2_24khz_100band_256x": "assets/audio_samples/device_noisy_freest/bigvgan_v2_24khz_100band_256x.wav",
        "bigvgan_base_24khz_100band": "assets/audio_samples/device_noisy_freest/bigvgan_base_24khz_100band.wav",
        "vocos_mel_24khz": "assets/audio_samples/device_noisy_freest/vocos_mel_24khz.wav",
        "comvo_large": "assets/audio_samples/device_noisy_freest/comvo_large.wav",
        "comvo_base": "assets/audio_samples/device_noisy_freest/comvo_base.wav",
        "periodwave_turbo": "assets/audio_samples/device_noisy_freest/periodwave_turbo.wav",
        "periodwave_24k": "assets/audio_samples/device_noisy_freest/periodwave_24k.wav",
        "flow2gan": "assets/audio_samples/device_noisy_freest/flow2gan.wav",
        "bridgevoc": "assets/audio_samples/device_noisy_freest/bridgevoc.wav",
        "rfwave_libritts_24k": "assets/audio_samples/device_noisy_freest/rfwave_libritts_24k.wav",
        "wavefm": "assets/audio_samples/device_noisy_freest/wavefm.wav",
        "rndvoc": "assets/audio_samples/device_noisy_freest/rndvoc.wav",
        "freev": "assets/audio_samples/device_noisy_freest/freev.wav",
        "hifigan_universal_v1": "assets/audio_samples/device_noisy_freest/hifigan_universal_v1.wav",
        "griffin_lim": "assets/audio_samples/device_noisy_freest/griffin_lim.wav"
      }
    }
  ]
};

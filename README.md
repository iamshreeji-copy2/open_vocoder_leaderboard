---
title: PRISM-V Open Neural Vocoder Leaderboard
emoji: 🎙️
colorFrom: indigo
colorTo: blue
sdk: gradio
sdk_version: 5.20.0
app_file: app.py
pinned: true
license: mit
short_description: "PRISM-V: Open Evaluation of Pretrained Neural Vocoders"
---

# 🎙️ PRISM-V: Open Evaluation of Pretrained Neural Vocoders

> **Quality · Robustness · Generalization · Efficiency**  
> *A multidimensional benchmark for understanding how modern pretrained neural vocoders perform across datasets, architectures, acoustic conditions, and deployment constraints.*

---

## Overview

PRISM-V evaluates **15 publicly-released, pretrained neural vocoder checkpoints** in a fully **training-free, zero-shot** setting across **4 diverse English corpora** (LJSpeech, LibriTTS, VCTK, Free_ST), with GPU hardware profiling under **Edge Profiling**.

---

## Key Features

| Dimension | Details |
|---|---|
| 🏆 **Models** | 15 architectures: BigVGAN-v2, Vocos, ComVo, PeriodWave, Flow2GAN, BridgeVoC, RFWave, WaveFM, RNDVoC, FreeV, HiFi-GAN, Griffin-Lim |
| 📊 **Corpora** | Clean studio (LJSpeech), Multi-speaker (LibriTTS), Accented (VCTK), Real-world Mobile (Free_ST) |
| 🔬 **Phoneme Diagnostics** | MFA phone-level alignment → per-ARPAbet class LSD, F0 error, boundary distortion |
| ⚡ **Hardware Profile** | Edge Profiling with synchronous CUDA barriers |
| 🎧 **Audio Explorer** | Interactive side-by-side listening: Ground Truth vs any two models |
| 📈 **Pareto Frontier** | Pareto-optimal models identified across Quality (PESQ/UTMOS) vs Efficiency (RTF/VRAM/Params) |

---

## Benchmark Navigation

| Page | Purpose |
|---|---|
| 🏆 **Leaderboard** | Main model ranking with interactive column selectors and dataset toggles |
| ⚖️ **Compare** | Direct side-by-side model comparison with radar charts and metric difference tables |
| 🎧 **Audio Explorer** | Listen to reference & model reconstructions across corpora |
| 📊 **Quality & Robustness** | Cross-corpus heatmaps and generalization analyses |
| ⚡ **Efficiency** | Throughput (xRT), real-time factor (RTF), latency, and peak VRAM |
| 🧠 **Architectures** | GAN vs Flow vs Fourier/Transformer vs Diffusion structural breakdown |
| 🔬 **Diagnostics** | Phoneme-level error heatmaps and failure analyses |
| 📈 **Pareto Frontier** | Multi-objective trade-off frontiers |
| 📦 **Models** | Individual model cards with checkpoint and code provenance |
| 🧪 **Methodology** | Benchmark protocol and metric definitions |
| ➕ **Submit Model** | Procedure to add new vocoder checkpoints |
| 📜 **Changelog & Citation** | Version history and copyable citation |

---

## Citation

```bibtex
@misc{purohit2026prismv,
  author       = {Ravindrakumar M. Purohit and Hemant A. Patil},
  title        = {{PRISM-V}: Multidimensional Evaluation of Pretrained
                  Neural Vocoders for Speech Synthesis},
  year         = {2026},
  howpublished = {Hugging Face Space},
  note         = {Open neural vocoder evaluation leaderboard}
}
```

# 🎙️ PRISM-V: Open Evaluation of Pretrained Neural Vocoders
### Static Web Benchmark Platform for GitHub Pages (`github.io`)

> **Quality · Robustness · Generalization · Efficiency**  
> *A multidimensional scientific benchmark for understanding how modern pretrained neural vocoders perform across datasets, architectures, acoustic conditions, and deployment constraints.*

---

## 🌟 Web Architecture (GitHub Pages)

This repository hosts the static web edition of the **PRISM-V Benchmark**. The application runs entirely on **client-side HTML, CSS (Tailwind), and JavaScript (Plotly.js)**.

```text
              Offline PRISM-V Evaluation
                       │
                       ▼
              CSV / JSON / Audio Assets
                       │
                       ▼
GitHub Pages ──► Static PRISM-V Platform (index.html)
                       │
             ┌─────────┼─────────┐
             ▼         ▼         ▼
        Leaderboard   Plots    Audio Explorer
```

- **Client-Side Rendering**: Instantaneous table filtering and dynamic recalculation.
- **Offline & Standalone Ready**: Pre-bundled dataset in `data/prism_data.js` allows opening `index.html` locally without CORS restrictions.

---

## 🚀 Quick Local Preview

To test or view the website locally, run:

```bash
cd /path/to/github_io
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your web browser.

---

## 🚢 Deploying to GitHub Pages

1. Push this directory to your GitHub repository (e.g. `open-vocoder-leaderboard.github.io` or repository branch `main` / `gh-pages`).
2. On GitHub, navigate to **Repository Settings** → **Pages**.
3. Under **Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` (or `gh-pages`), folder `/ (root)`
4. Click **Save**. Within ~1 minute, your site will be live at:
   `https://<username>.github.io/<repo>/`

---

## 📊 Benchmark Navigation Flow

| Section | Description |
|---|---|
| 🌟 **Overview** | Executive summary, scientific motivation, KPI highlights, and architecture distribution |
| 🏆 **Leaderboard** | Interactive ranking table with dynamic multi-corpus PESQ recomputation, custom weighting, and CSV/JSON export |
| ⚖️ **Compare** | Direct side-by-side model comparison matrix and multi-dimensional radar charts |
| 🎧 **Audio Explorer** | Side-by-side listening: Ground Truth reference vs any 2 models with canvas waveforms and synchronized playback |
| 📊 **Quality & Robustness** | Cross-corpus heatmaps (LJSpeech, LibriTTS, VCTK, Free_ST) and generalization analyses |
| ⚡ **Efficiency** | Throughput (xRT), real-time factor (RTF), latency, peak VRAM, and real-time threshold lines |
| 🧠 **Architectures** | Generative paradigms: GAN vs Flow vs Fourier/Transformer vs Diffusion SDE |
| 🔬 **Diagnostics** | Montreal Forced Aligner (MFA) phoneme-level error heatmaps and radar charts |
| 📈 **Pareto Frontier** | Multi-objective trade-off frontiers across quality vs latency, VRAM, and model size |
| 📦 **Models** | Complete model registry with code links, checkpoint sources, and per-corpus tables |
| 🧪 **Methodology** | Benchmark protocol, inference parameters, and metric definitions |
| ➕ **Submit Model** | Procedure and Python adapter code (`BaseVocoderAdapter`) to add new vocoders |
| 📜 **Changelog & Citation** | Version history and 1-click copyable BibTeX citation |

---

## 📙 Citation

If you use the PRISM-V benchmark, evaluated checkpoints, audio samples, or leaderboard codebase in your research, please cite:

```bibtex
@misc{purohit2026prismv,
  author       = {Ravindrakumar M. Purohit and Hemant A. Patil},
  title        = {{PRISM-V}: Multidimensional Evaluation of Pretrained
                  Neural Vocoders for Speech Synthesis},
  year         = {2026},
  howpublished = {GitHub Pages / Hugging Face Space},
  note         = {Open neural vocoder evaluation leaderboard}
}
```

---

## 📜 License

- Benchmark Evaluation Data: **Creative Commons Attribution 4.0 International (CC-BY 4.0)**
- Web Platform Code: **MIT License**

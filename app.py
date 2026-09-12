"""
app.py — PRISM-V: Open Neural Vocoder Evaluation
Multi-tab research benchmark platform · Gradio 5+ / 6+ · SDK: gradio ≥ 5.20
"""

import os, json, math, base64
import gradio as gr
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px

from constants import (
    PRISM_NAME, PRISM_FULL, PRISM_TAGLINE, PRISM_DESC, PRISM_VERSION,
    GITHUB_URL, ARCH_CATEGORIES, MODEL_ARCH_TAGS, MODEL_ARCH_CATEGORY,
    ARCH_FAMILY_TO_CATEGORY, MODEL_OS_STATUS, MODEL_LINKS, DATASETS,
    TRACKS, METRIC_DEFS, COLUMN_GROUPS, FAMILY_COLORS, ARCH_CAT_COLORS,
    BIBTEX, METHODOLOGY_MD, CHANGELOG_MD,
)

# ═══════════════════════════════════════════════════════════════════════════════
# Paths & Logo
# ═══════════════════════════════════════════════════════════════════════════════
BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
DATA_DIR  = os.path.join(BASE_DIR, "data")
AUDIO_DIR = os.path.join(BASE_DIR, "assets", "audio_samples")

def get_logo_data_uri():
    for candidate in [
        os.path.join(BASE_DIR, "assets", "logo_web.png"),
        os.path.join(BASE_DIR, "assets", "logo.png"),
        os.path.join(BASE_DIR, "logo.png"),
    ]:
        if os.path.exists(candidate):
            try:
                with open(candidate, "rb") as f:
                    b64 = base64.b64encode(f.read()).decode("utf-8")
                    return f"data:image/png;base64,{b64}"
            except Exception:
                pass
    return ""

LOGO_DATA_URI = get_logo_data_uri()

# ═══════════════════════════════════════════════════════════════════════════════
# Load and enrich data
# ═══════════════════════════════════════════════════════════════════════════════
DF_LB    = pd.read_csv(os.path.join(DATA_DIR, "leaderboard_data.csv"))
DF_PHONE = pd.read_csv(os.path.join(DATA_DIR, "phoneme_diagnostics.csv"))
DF_DS    = pd.read_csv(os.path.join(DATA_DIR, "dataset_breakdown.csv"))
with open(os.path.join(DATA_DIR, "arena_manifest.json")) as f:
    ARENA = json.load(f)

for mid, status in MODEL_OS_STATUS.items():
    DF_LB.loc[DF_LB["model_id"]==mid, "code_open"] = "✅ Open" if status["code_open"] else "❌ Closed"
    DF_LB.loc[DF_LB["model_id"]==mid, "ckpt_open"] = "✅ Open" if status["ckpt_open"] else "❌ Closed"
for mid, cat in MODEL_ARCH_CATEGORY.items():
    DF_LB.loc[DF_LB["model_id"]==mid, "arch_category"] = cat

# Default ranking: sort by PRISM-V Score descending (highest score = rank 1)
DF_LB = DF_LB.sort_values("overall_score", ascending=False).reset_index(drop=True)
DF_LB["rank"] = range(1, len(DF_LB) + 1)

ALL_MODEL_IDS   = DF_LB["model_id"].tolist()
ALL_MODEL_NAMES = DF_LB["model_name"].tolist()
NAME_TO_ID      = dict(zip(DF_LB["model_name"], DF_LB["model_id"]))
ID_TO_ROW       = {r["model_id"]: r.to_dict() for _, r in DF_LB.iterrows()}
DATASET_COLS    = ["LJSpeech", "LibriTTS", "VCTK", "Free_ST"]

# ═══════════════════════════════════════════════════════════════════════════════
# Helper functions
# ═══════════════════════════════════════════════════════════════════════════════
def medal(rank):
    return {1: "🥇 1", 2: "🥈 2", 3: "🥉 3"}.get(int(rank), str(int(rank)))

def format_rank_score(rank_num, score_val):
    rank_int = int(rank_num)
    if rank_int == 1:
        medal_char = "🥇"
        cls = "rank-gold"
    elif rank_int == 2:
        medal_char = "🥈"
        cls = "rank-silver"
    elif rank_int == 3:
        medal_char = "🥉"
        cls = "rank-bronze"
    else:
        medal_char = ""
        cls = "rank-regular"

    medal_html = f'<span class="rank-medal">{medal_char}</span>' if medal_char else ''
    return (
        f'<div class="rank-score-pill {cls}">'
        f'{medal_html}'
        f'<span class="rank-num">#{rank_int}</span>'
        f'<span class="rank-divider">·</span>'
        f'<span class="rank-score">{score_val:.1f}</span>'
        f'</div>'
    )

def build_lb_row(r, datasets, visible_cols):
    """Build a single leaderboard display row dict."""
    ds_row = DF_DS[DF_DS["model_id"] == r["model_id"]]
    ds_pesqs = {
        d: float(ds_row[ds_row["dataset"] == d]["pesq"].values[0])
        if not ds_row[ds_row["dataset"] == d].empty else None
        for d in DATASET_COLS
    }
    active_pesqs = [v for k, v in ds_pesqs.items() if v is not None and k in datasets]
    avg_pesq = float(np.mean(active_pesqs)) if active_pesqs else float(r.get("pesq", 0.0))

    links = MODEL_LINKS.get(r["model_id"], {})
    gh_url = links.get("github", "")
    ckpt_url = links.get("checkpoint", "")

    # Clean model name text (no raw URL text)
    model_name_str = r["model_name"]

    # Styled GitHub button with hidden link
    if gh_url:
        code_str = (
            f'<a href="{gh_url}" target="_blank" rel="noopener noreferrer" '
            f'style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:6px;'
            f'background:#24292e;color:#ffffff;text-decoration:none;font-size:11px;font-weight:600;'
            f'font-family:Arial,sans-serif;box-shadow:0 1px 2px rgba(0,0,0,0.3);">'
            f'💻 GitHub</a>'
        )
    else:
        code_str = '<span style="color:#64748b;font-size:11px;">—</span>'

    # Styled Checkpoint button with hidden link
    if ckpt_url and not ckpt_url.startswith("N/A"):
        ckpt_str = (
            f'<a href="{ckpt_url}" target="_blank" rel="noopener noreferrer" '
            f'style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:6px;'
            f'background:#4f46e5;color:#ffffff;text-decoration:none;font-size:11px;font-weight:600;'
            f'font-family:Arial,sans-serif;box-shadow:0 1px 2px rgba(0,0,0,0.3);">'
            f'📦 Checkpoint</a>'
        )
    else:
        ckpt_str = '<span style="color:#64748b;font-size:11px;font-style:italic;">Algorithmic</span>'

    score_val = r['overall_score']
    rank_val = r.get("rank", 0)

    row = {
        "Rank & PRISM-V ↑": format_rank_score(rank_val, score_val),
        "Model":            model_name_str,
        "PESQ ↑":           f"{avg_pesq:.3f}",
        "STOI ↑":           f"{r['stoi']:.3f}",
        "MCD ↓":            f"{r['mcd_db']:.2f}",
        "LSD ↓":            f"{r.get('lsd_db', 0):.2f}",
        "UTMOS ↑":          f"{r['utmos']:.2f}",
        "NISQA ↑":          f"{r.get('nisqa', 0):.2f}",
        "ΔWER ↓":           f"{r['delta_wer_pct']:.2f}%",
        "RTF ↓":            f"{r['rtf']:.4f}",
        "xRT ↑":            f"{r['speedup_x']:.0f}×",
        "VRAM (MB) ↓":      f"{r['peak_vram_mb']:.0f}",
        "Params (M)":       f"{r['params_m']:.1f}",
        "License":          r["license"],
        "Architecture":     r["architecture_family"],
        "Track":            r["track"],
        "Year":             str(int(r["year"])),
        "Code":             code_str,
        "Checkpoint":       ckpt_str,
        "Pareto ⭐":        "⭐" if r["is_pareto"] else "—",
        "Edge ⚡":          "✅" if r["edge_feasible"] == "Yes" else "❌",
    }
    for d in DATASET_COLS:
        row[d] = f"{ds_pesqs[d]:.3f}" if ds_pesqs.get(d) is not None else "—"
    return row

def build_display_df(df, datasets, visible_cols):
    df = df.copy()
    # Default ranking: sorted strictly by PRISM-V Score descending
    df = df.sort_values("overall_score", ascending=False).reset_index(drop=True)
    df["rank"] = range(1, len(df) + 1)
    rows = []
    for _, r in df.iterrows():
        row = build_lb_row(r, datasets, visible_cols)
        rows.append(row)
    result = pd.DataFrame(rows)
    always_cols = ["Rank & PRISM-V ↑", "Model"]
    extra_cols = [c for c in visible_cols if c not in always_cols and c not in ("Rank", "Rank Δ", "PRISM-V Score ↑")]
    cols_to_show = [c for c in always_cols + extra_cols if c in result.columns]
    return result[cols_to_show]

def filter_df(df, search, datasets, track, arch_cats, edge_only, code_filter, ckpt_filter):
    df = df.copy()
    if track and track != "All Tracks":
        df = df[df["track"] == track]
    if arch_cats:
        def has_arch(mid):
            tags = MODEL_ARCH_TAGS.get(mid, set())
            return any(c in tags for c in arch_cats)
        df = df[df["model_id"].apply(has_arch)]
    if edge_only:
        df = df[df["edge_feasible"] == "Yes"]
    if code_filter == "Open-Source Code Only":
        df = df[df["code_open"].str.contains("Open", na=False)]
    elif code_filter == "Closed-Source Only":
        df = df[df["code_open"].str.contains("Closed", na=False)]
    if ckpt_filter == "Open Checkpoints Only":
        df = df[df["ckpt_open"].str.contains("Open", na=False)]
    elif ckpt_filter == "Proprietary Only":
        df = df[df["ckpt_open"].str.contains("Closed", na=False)]
    if search and search.strip():
        terms = [t.strip().lower() for t in search.split(",") if t.strip()]
        mask = pd.Series([False] * len(df), index=df.index)
        for t in terms:
            mask |= df["model_name"].str.lower().str.contains(t, na=False)
        df = df[mask]
    return df

# ═══════════════════════════════════════════════════════════════════════════════
# Plot Builders
# ═══════════════════════════════════════════════════════════════════════════════
def make_pareto_plot(df, x_col, y_col, log_x, show_pareto):
    fig = go.Figure()
    for fam in sorted(df["architecture_family"].unique()):
        sub = df[df["architecture_family"] == fam]
        color = FAMILY_COLORS.get(fam, "#4F46E5")
        hover = [
            f"<b>{r['model_name']}</b><br>"
            f"Family: {r['architecture_family']}<br>"
            f"PESQ: {r['pesq']:.3f} · STOI: {r['stoi']:.3f}<br>"
            f"UTMOS: {r['utmos']:.2f} · ΔWER: {r['delta_wer_pct']:.2f}%<br>"
            f"RTF: {r['rtf']:.4f} ({r['speedup_x']:.0f}× RT)<br>"
            f"VRAM: {r['peak_vram_mb']:.0f} MB · Params: {r['params_m']:.1f}M<br>"
            f"Code: {r.get('code_open','—')} · Ckpt: {r.get('ckpt_open','—')}"
            for _, r in sub.iterrows()
        ]
        fig.add_trace(go.Scatter(
            x=sub[x_col], y=sub[y_col], mode="markers+text", name=fam,
            text=sub["model_name"], textposition="top center",
            textfont=dict(size=9, family="Arial, sans-serif"),
            hovertext=hover, hoverinfo="text",
            marker=dict(size=14, color=color, opacity=0.9,
                        line=dict(width=1.5, color="#ffffff")),
        ))
    if show_pareto:
        pf = df[df["is_pareto"] == True].sort_values(x_col)
        if len(pf) > 1:
            fig.add_trace(go.Scatter(
                x=pf[x_col], y=pf[y_col], mode="lines",
                name="Pareto Frontier",
                line=dict(color="#DC2626", width=2.5, dash="dash"),
                hoverinfo="skip",
            ))
    xlabels = {"rtf": "RTF (↓ lower = faster)", "peak_vram_mb": "Peak VRAM (MB)", "params_m": "Params (M)"}
    ylabels = {"pesq": "PESQ (↑ higher = better)", "utmos": "UTMOS (↑)", "stoi": "STOI (↑)",
               "overall_score": "PRISM-V Score (↑)", "delta_wer_pct": "ΔWER % (↓)"}
    fig.update_layout(
        title=f"<b>{ylabels.get(y_col,y_col)}</b> vs <b>{xlabels.get(x_col,x_col)}</b>",
        xaxis_title=xlabels.get(x_col, x_col), yaxis_title=ylabels.get(y_col, y_col),
        xaxis_type="log" if log_x and x_col in ["rtf", "params_m"] else "linear",
        template="plotly_white", hovermode="closest", height=560,
        font=dict(family="Arial, sans-serif"),
        legend=dict(orientation="h", y=-0.36, x=0.5, xanchor="center", font=dict(size=10)),
        margin=dict(l=60, r=40, t=55, b=140),
    )
    return fig

def make_radar(df_phone, models):
    cats = ["Vowels", "Stops / Plosives", "Fricatives", "Affricates", "Nasals", "Liquids", "Glides"]
    colors = list(FAMILY_COLORS.values())
    fig = go.Figure()
    for i, m in enumerate(models):
        sub = df_phone[df_phone["model_name"] == m]
        if sub.empty: continue
        vm = dict(zip(sub["phonetic_class"], sub["lsd_db"]))
        r  = [vm.get(c, 0) for c in cats] + [vm.get(cats[0], 0)]
        c  = colors[i % len(colors)]
        fig.add_trace(go.Scatterpolar(
            r=r, theta=cats + [cats[0]], name=m,
            line=dict(color=c, width=2), fill="toself",
            fillcolor=f"rgba({int(c[1:3],16)},{int(c[3:5],16)},{int(c[5:7],16)},0.10)",
        ))
    max_lsd = df_phone["lsd_db"].max() * 1.2 if not df_phone.empty else 15.0
    fig.update_layout(
        polar=dict(radialaxis=dict(visible=True, range=[0, max_lsd])),
        title="<b>Phoneme-Resolved Log-Spectral Distance (dB)</b> — lower = better",
        template="plotly_white", height=500,
        font=dict(family="Arial, sans-serif"),
        legend=dict(orientation="h", y=-0.22, x=0.5, xanchor="center"),
    )
    return fig

def make_phoneme_bar(df_phone, metric):
    lbl = {"lsd_db": "LSD (dB) ↓", "boundary_error_db": "Boundary Error (dB)", "f0_error_cents": "F0 Error (cents)"}
    fig = px.bar(df_phone, x="phonetic_class", y=metric, color="family", barmode="group",
                 title=f"<b>Phonetic Error by Category</b> — {lbl.get(metric, metric)}",
                 labels={"phonetic_class": "Phonetic Class", metric: lbl.get(metric, metric), "family": "Architecture"},
                 color_discrete_map=FAMILY_COLORS, template="plotly_white")
    fig.update_layout(height=460, font=dict(family="Arial, sans-serif"),
                      legend=dict(orientation="h", y=-0.38, x=0.5, xanchor="center"))
    return fig

def make_dataset_heatmap(df_ds, metric):
    pivot = df_ds.pivot(index="model_name", columns="dataset", values=metric)
    pivot["mean"] = pivot.mean(axis=1)
    pivot = pivot.sort_values("mean", ascending=False).drop(columns="mean")
    fig = go.Figure(go.Heatmap(
        z=pivot.values, x=list(pivot.columns), y=list(pivot.index),
        colorscale="RdYlGn" if metric in ["pesq", "stoi"] else "RdYlGn_r",
        text=[[f"{v:.3f}" for v in row] for row in pivot.values],
        texttemplate="%{text}", showscale=True,
        hoverongaps=False, colorbar=dict(title=metric.upper()),
    ))
    lbl = {"pesq": "PESQ ↑", "stoi": "STOI ↑", "lsd_db": "LSD (dB) ↓", "mcd_db": "MCD (dB) ↓"}
    fig.update_layout(
        title=f"<b>Cross-Corpus Generalization Heatmap</b> — {lbl.get(metric, metric)}",
        template="plotly_white", height=520, font=dict(family="Arial, sans-serif"),
        margin=dict(l=180, r=60, t=55, b=80),
        xaxis=dict(title="Corpus"), yaxis=dict(title="Model"),
    )
    return fig

def make_dataset_bar(df_ds, metric):
    lbl = {"pesq": "PESQ ↑", "stoi": "STOI ↑", "lsd_db": "LSD (dB) ↓", "mcd_db": "MCD (dB) ↓"}
    fig = px.bar(df_ds, x="model_name", y=metric, color="dataset", barmode="group",
                 title=f"<b>Cross-Corpus Breakdown</b> — {lbl.get(metric, metric)}",
                 labels={"model_name": "Model", metric: lbl.get(metric, metric), "dataset": "Corpus"},
                 color_discrete_sequence=["#3B82F6", "#10B981", "#F59E0B", "#EC4899"],
                 template="plotly_white")
    fig.update_layout(xaxis_tickangle=-40, height=500, font=dict(family="Arial, sans-serif"),
                      legend=dict(orientation="h", y=-0.38, x=0.5, xanchor="center"))
    return fig

def make_efficiency_bar():
    df = DF_LB.sort_values("speedup_x", ascending=True)
    colors = [FAMILY_COLORS.get(f, "#4F46E5") for f in df["architecture_family"]]
    fig = go.Figure()
    fig.add_trace(go.Bar(
        y=df["model_name"], x=df["speedup_x"], orientation="h",
        marker_color=colors, text=[f"{x:.0f}×" for x in df["speedup_x"]],
        textposition="outside",
        customdata=df[["rtf", "peak_vram_mb", "edge_feasible", "code_open", "ckpt_open"]].values,
        hovertemplate="<b>%{y}</b><br>xRT: %{x:.0f}×<br>RTF: %{customdata[0]:.4f}<br>VRAM: %{customdata[1]:.0f} MB<br>Edge: %{customdata[2]}<br>Code: %{customdata[3]}<extra></extra>",
    ))
    fig.update_layout(
        title="<b>Throughput (xRT = 1/RTF) — Edge Profiling</b> — higher = faster",
        xaxis_title="Throughput ×RT (higher = better)", yaxis_title="",
        template="plotly_white", height=520, font=dict(family="Arial, sans-serif"),
        margin=dict(l=180, r=80, t=55, b=40),
        shapes=[dict(type="line", x0=1, x1=1, y0=-0.5, y1=len(df)-0.5,
                     line=dict(color="#DC2626", width=1.5, dash="dash"))],
        annotations=[dict(x=1.5, y=len(df)*0.95, text="Real-time threshold (1.0×)",
                          font=dict(color="#DC2626", size=10, family="Arial, sans-serif"), showarrow=False)],
    )
    return fig

def rerank(wp, ws, wu, wsp):
    df = DF_LB.copy()
    total = wp + ws + wu + wsp or 1
    df["custom"] = (
        wp / total * (df["pesq"] - 1) / 3.5 * 100 +
        ws / total * (df["stoi"] - 0.5) / 0.5 * 100 +
        wu / total * (df["utmos"] - 1) / 4.0 * 100 +
        wsp / total * df["speedup_x"].apply(lambda x: max(0, min(100, math.log10(x + 1e-3) / math.log10(500) * 100)))
    )
    df = df.sort_values("custom", ascending=False).reset_index(drop=True)
    df["Rank"] = [medal(i + 1) for i in range(len(df))]
    return df[["Rank", "model_name", "architecture_family", "pesq", "stoi", "utmos", "rtf", "speedup_x", "custom"]].rename(
        columns={"model_name": "Model", "architecture_family": "Architecture",
                 "pesq": "PESQ", "stoi": "STOI", "utmos": "UTMOS",
                 "rtf": "RTF", "speedup_x": "xRT", "custom": "Custom Score"})

# ═══════════════════════════════════════════════════════════════════════════════
# UI HTML snippets
# ═══════════════════════════════════════════════════════════════════════════════
DARK_MODE_JS = """<script>
(function() {
  const FONT_SCALES = {
    1: 0.82,
    2: 0.91,
    3: 1.00,
    4: 1.12,
    5: 1.25
  };

  const THEME_VARS = {
    dark: {
      '--rank-gold-bg': 'linear-gradient(135deg, rgba(251, 191, 36, 0.24) 0%, rgba(245, 158, 11, 0.38) 100%)',
      '--rank-gold-border': '#F59E0B',
      '--rank-gold-color': '#FEF08A',
      '--rank-gold-shadow': '0 0 12px rgba(245, 158, 11, 0.35), inset 0 0 6px rgba(251, 191, 36, 0.2)',

      '--rank-silver-bg': 'linear-gradient(135deg, rgba(226, 232, 240, 0.20) 0%, rgba(148, 163, 184, 0.35) 100%)',
      '--rank-silver-border': '#CBD5E1',
      '--rank-silver-color': '#F8FAFC',
      '--rank-silver-shadow': '0 0 10px rgba(203, 213, 225, 0.28)',

      '--rank-bronze-bg': 'linear-gradient(135deg, rgba(254, 215, 170, 0.20) 0%, rgba(234, 88, 12, 0.32) 100%)',
      '--rank-bronze-border': '#EA580C',
      '--rank-bronze-color': '#FED7AA',
      '--rank-bronze-shadow': '0 0 10px rgba(234, 88, 12, 0.28)',

      '--rank-reg-bg': 'rgba(129, 140, 248, 0.08)',
      '--rank-reg-border': 'rgba(129, 140, 248, 0.25)',
      '--rank-reg-color': '#F8FAFC',
      '--rank-reg-score': '#818CF8',

      '--prism-p': '#818CF8',
      '--prism-r': '#A78BFA',
      '--prism-i': '#22D3EE',
      '--prism-s': '#4ADE80',
      '--prism-m': '#FCD34D',
      '--prism-suffix': '#818CF8',

      '--prism-dim-p-bg': 'rgba(129,140,248,0.12)',
      '--prism-dim-p-border': '#818CF8',
      '--prism-dim-p-color': '#818CF8',
      '--prism-dim-r-bg': 'rgba(167,139,250,0.12)',
      '--prism-dim-r-border': '#A78BFA',
      '--prism-dim-r-color': '#A78BFA',
      '--prism-dim-i-bg': 'rgba(34,211,238,0.12)',
      '--prism-dim-i-border': '#22D3EE',
      '--prism-dim-i-color': '#22D3EE',
      '--prism-dim-s-bg': 'rgba(74,222,128,0.12)',
      '--prism-dim-s-border': '#4ADE80',
      '--prism-dim-s-color': '#4ADE80',
      '--prism-dim-m-bg': 'rgba(252,211,77,0.12)',
      '--prism-dim-m-border': '#FCD34D',
      '--prism-dim-m-color': '#FCD34D'
    },
    light: {
      '--rank-gold-bg': 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
      '--rank-gold-border': '#B45309',
      '--rank-gold-color': '#78350F',
      '--rank-gold-shadow': '0 2px 8px rgba(180, 83, 9, 0.35)',

      '--rank-silver-bg': 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
      '--rank-silver-border': '#475569',
      '--rank-silver-color': '#0F172A',
      '--rank-silver-shadow': '0 2px 6px rgba(71, 85, 105, 0.25)',

      '--rank-bronze-bg': 'linear-gradient(135deg, #FFEDD5 0%, #FED7AA 100%)',
      '--rank-bronze-border': '#9A3412',
      '--rank-bronze-color': '#7C2D12',
      '--rank-bronze-shadow': '0 2px 6px rgba(154, 52, 18, 0.3)',

      '--rank-reg-bg': '#EEF2FF',
      '--rank-reg-border': '#818CF8',
      '--rank-reg-color': '#1E1B4B',
      '--rank-reg-score': '#3730A3',

      '--prism-p': '#3730A3',
      '--prism-r': '#5B21B6',
      '--prism-i': '#0E7490',
      '--prism-s': '#15803D',
      '--prism-m': '#9A3412',
      '--prism-suffix': '#3730A3',

      '--prism-dim-p-bg': '#EEF2FF',
      '--prism-dim-p-border': '#818CF8',
      '--prism-dim-p-color': '#3730A3',
      '--prism-dim-r-bg': '#F5F3FF',
      '--prism-dim-r-border': '#A78BFA',
      '--prism-dim-r-color': '#5B21B6',
      '--prism-dim-i-bg': '#ECFEFF',
      '--prism-dim-i-border': '#22D3EE',
      '--prism-dim-i-color': '#0E7490',
      '--prism-dim-s-bg': '#DCFCE7',
      '--prism-dim-s-border': '#4ADE80',
      '--prism-dim-s-color': '#15803D',
      '--prism-dim-m-bg': '#FEF3C7',
      '--prism-dim-m-border': '#FCD34D',
      '--prism-dim-m-color': '#9A3412'
    }
  };

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    const bg = isDark ? '#0B1120' : '#FFFFFF';
    const fg = isDark ? '#F8FAFC' : '#0F172A';

    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.backgroundColor = bg;
    document.documentElement.style.color = fg;
    document.documentElement.style.colorScheme = theme;

    const vars = THEME_VARS[theme] || THEME_VARS.dark;
    for (const [k, v] of Object.entries(vars)) {
      document.documentElement.style.setProperty(k, v);
      if (document.body) document.body.style.setProperty(k, v);
    }

    const els = [
      document.documentElement,
      document.body,
      document.querySelector('gradio-app'),
      document.querySelector('.gradio-container')
    ];
    document.querySelectorAll('.contain, .main, .gradio-container, gradio-app').forEach(el => els.push(el));

    els.filter(Boolean).forEach(el => {
      el.setAttribute('data-theme', theme);
      if (isDark) {
        el.classList.add('dark');
        el.classList.remove('light');
      } else {
        el.classList.remove('dark');
        el.classList.add('light');
      }
    });

    const icon = document.getElementById('theme-icon');
    if (icon) icon.textContent = isDark ? '☀️' : '🌙';
  }

  function applyFontLevel(level) {
    level = Math.max(1, Math.min(5, parseInt(level, 10) || 3));
    const scale = FONT_SCALES[level] || 1.0;

    document.documentElement.setAttribute('data-font-level', level);
    document.documentElement.style.setProperty('--font-scale', scale);
    document.documentElement.style.fontSize = (14 * scale) + 'px';
    if (document.body) {
      document.body.style.fontSize = (14 * scale) + 'px';
    }
    const container = document.querySelector('.gradio-container');
    if (container) {
      container.style.fontSize = (14 * scale) + 'px';
    }

    // Update active dot indicators in merged toolbar
    document.querySelectorAll('.font-dot').forEach(function(dot) {
      const dLevel = parseInt(dot.getAttribute('data-level'), 10);
      if (dLevel === level) {
        dot.classList.add('active');
        dot.setAttribute('aria-checked', 'true');
      } else {
        dot.classList.remove('active');
        dot.setAttribute('aria-checked', 'false');
      }
    });

    // Update step button disabled state
    const decBtn = document.getElementById('font-dec-btn');
    const incBtn = document.getElementById('font-inc-btn');
    if (decBtn) decBtn.disabled = (level <= 1);
    if (incBtn) incBtn.disabled = (level >= 5);
  }

  const savedTheme = localStorage.getItem('prism-theme') || 'dark';
  applyTheme(savedTheme);

  const savedFont = localStorage.getItem('prism-font-level') || '3';
  applyFontLevel(savedFont);

  window.togglePrismTheme = function() {
    const cur = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = cur === 'dark' ? 'light' : 'dark';
    localStorage.setItem('prism-theme', next);
    applyTheme(next);
  };

  window.setPrismFontLevel = function(level) {
    localStorage.setItem('prism-font-level', level);
    applyFontLevel(level);
  };

  window.stepPrismFont = function(delta) {
    const cur = parseInt(localStorage.getItem('prism-font-level') || '3', 10);
    const next = Math.max(1, Math.min(5, cur + delta));
    window.setPrismFontLevel(next);
  };

  document.addEventListener('DOMContentLoaded', function() {
    applyTheme(localStorage.getItem('prism-theme') || 'dark');
    applyFontLevel(localStorage.getItem('prism-font-level') || '3');
  });

  window.addEventListener('load', function() {
    applyTheme(localStorage.getItem('prism-theme') || 'dark');
    applyFontLevel(localStorage.getItem('prism-font-level') || '3');
  });

  const observer = new MutationObserver(function() {
    const currentTheme = localStorage.getItem('prism-theme') || 'dark';
    const currentFont = localStorage.getItem('prism-font-level') || '3';
    const app = document.querySelector('gradio-app');
    if (app && (app.getAttribute('data-theme') !== currentTheme || app.style.backgroundColor === '')) {
      applyTheme(currentTheme);
      applyFontLevel(currentFont);
    }
  });
  if (document.documentElement) {
    observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true });
  }
})();
</script>"""

BANNER_HTML = f"""
<!-- Merged Accessibility & Theme Control Toolbar (Fixed Top-Right) -->
<div id="prism-accessibility-toolbar" role="toolbar" aria-label="Accessibility and Display Controls">
  <span class="toolbar-label" title="Accessibility Font Size (5 Levels: Smallest to Largest)">🔤</span>
  <button id="font-dec-btn" class="font-step-btn" onclick="window.stepPrismFont && window.stepPrismFont(-1)" title="Decrease font size (A−)" aria-label="Decrease font size">A−</button>
  <div class="font-scale-dots" role="radiogroup" aria-label="Font scale 1 to 5">
    <button class="font-dot" data-level="1" onclick="window.setPrismFontLevel && window.setPrismFontLevel(1)" title="Scale 1/5: Smallest (82%)" aria-label="Font level 1 smallest">1</button>
    <button class="font-dot" data-level="2" onclick="window.setPrismFontLevel && window.setPrismFontLevel(2)" title="Scale 2/5: Small (91%)" aria-label="Font level 2 small">2</button>
    <button class="font-dot default-dot active" data-level="3" onclick="window.setPrismFontLevel && window.setPrismFontLevel(3)" title="Scale 3/5: Default (100% · Current)" aria-label="Font level 3 default">3</button>
    <button class="font-dot" data-level="4" onclick="window.setPrismFontLevel && window.setPrismFontLevel(4)" title="Scale 4/5: Large (112%)" aria-label="Font level 4 large">4</button>
    <button class="font-dot" data-level="5" onclick="window.setPrismFontLevel && window.setPrismFontLevel(5)" title="Scale 5/5: Largest (125%)" aria-label="Font level 5 largest">5</button>
  </div>
  <button id="font-inc-btn" class="font-step-btn" onclick="window.stepPrismFont && window.stepPrismFont(1)" title="Increase font size (A+)" aria-label="Increase font size">A+</button>
  <div class="toolbar-divider" aria-hidden="true"></div>
  <button id="theme-toggle-btn" onclick="window.togglePrismTheme && window.togglePrismTheme()" title="Toggle Dark / Light Mode" aria-label="Toggle Dark / Light Mode">
    <span id="theme-icon">☀️</span>
  </button>
</div>

<!-- Banner Header -->
<div id="prism-banner" class="prism-banner-bg" style="
  border-radius:22px; padding:26px 24px 20px; margin-bottom:20px;
  position:relative; overflow:hidden; text-align:center;
  display:flex; flex-direction:column; align-items:center; justify-content:center;">

  <!-- Centered Hero Logo -->
  <div id="banner-logo-wrapper" style="display:flex; justify-content:center; align-items:center; width:100%; margin:0 auto 14px; text-align:center;">
    <img id="prism-logo" src="{LOGO_DATA_URI}" alt="PRISM-V Benchmark Logo" style="max-width:310px; width:100%; height:auto; display:block; margin:0 auto; border-radius:14px; object-fit:contain; background:#FFFFFF; padding:6px 10px; border:1.5px solid var(--border-2, #334155); box-shadow:0 4px 16px rgba(0,0,0,0.18);" />
  </div>

  <!-- Centered Benchmark Information -->
  <div style="max-width:840px; width:100%; margin:0 auto 16px; text-align:center; display:flex; flex-direction:column; align-items:center;">
    <h1 id="banner-title" style="font-family:Arial,sans-serif;margin:0 auto 6px;font-weight:800;letter-spacing:-0.5px;text-align:center;font-size:clamp(2.2rem,5vw,3.2rem);">
      <span class="prism-rainbow-text prism-glow">
        <span class="prism-p">P</span><span class="prism-r">R</span><span class="prism-i">I</span><span class="prism-s">S</span><span class="prism-m">M</span><span class="prism-suffix" style="color:var(--text-primary,#F8FAFC);">-V</span>
      </span> 🤗
    </h1>
    <div class="prism-dimension-bar">
      <span class="prism-dim-pill prism-dim-p" title="P: Perceptual quality (UTMOS + NISQA-TTS MOS)"><b>P</b> · Perceptual</span>
      <span class="prism-dim-pill prism-dim-r" title="R: Reconstruction fidelity (PESQ + MCD + LSD)"><b>R</b> · Reconstruction</span>
      <span class="prism-dim-pill prism-dim-i" title="I: Intelligibility preservation (STOI + ΔWER)"><b>I</b> · Intelligibility</span>
      <span class="prism-dim-pill prism-dim-s" title="S: Speaker preservation (Speaker-embedding cosine)"><b>S</b> · Speaker</span>
      <span class="prism-dim-pill prism-dim-m" title="M: Model efficiency (RTF + VRAM + Params)"><b>M</b> · Model Efficiency</span>
    </div>
    <p id="banner-subtitle" style="margin:0 auto 6px;font-weight:600;font-family:Arial,sans-serif;text-align:center;">
      Open Evaluation of Pretrained Neural Vocoders · Ranked by <span class="prism-rainbow-text"><span class="prism-p">P</span><span class="prism-r">R</span><span class="prism-i">I</span><span class="prism-s">S</span><span class="prism-m">M</span><span class="prism-suffix">-V Score</span></span> (Default)
    </p>
    <p id="banner-desc" style="margin:0 auto;max-width:800px;line-height:1.55;font-family:Arial,sans-serif;text-align:center;">
      {PRISM_DESC}
    </p>
  </div>

  <!-- Centered Metric Badges Row -->
  <div style="display:flex; flex-wrap:wrap; justify-content:center; align-items:center; gap:8px; width:100%; margin:0 auto; text-align:center;">
    <span class="banner-badge badge-models">
      🏆 15 Pretrained Models
    </span>
    <span class="banner-badge badge-corpora">
      📂 4 Evaluated Corpora
    </span>
    <span class="banner-badge badge-edge">
      ⚡ Edge Profiling
    </span>
    <span class="banner-badge badge-qc">
      🔬 MFA Phoneme-Resolved QC
    </span>
    <span class="banner-badge badge-ver">
      📋 Benchmark {PRISM_VERSION}
    </span>
  </div>
</div>
"""

COL_LEGEND_HTML = """
<div style="display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:8px;margin:6px auto 14px;font-family:Arial,sans-serif;text-align:center;">
  <div style="display:flex;align-items:center;gap:5px;padding:4px 10px;border-radius:6px;font-size:.74rem;font-weight:700;background:rgba(129,140,248,0.12);border:1.5px solid #818CF8;">
    🏆 Rank &amp; PRISM-V (Default 1–100)
  </div>
  <div class="col-legend-item col-legend-obj">📐 Objective Metrics (Blue)</div>
  <div class="col-legend-item col-legend-subj">👂 Perceptual / Subjective (Violet)</div>
  <div class="col-legend-item col-legend-perf">⚡ Performance &amp; Efficiency (Amber)</div>
  <div class="col-legend-item col-legend-rob">🛡️ Robustness / Per-Corpus (Green)</div>
  <div style="display:flex;align-items:center;gap:6px;padding:4px 10px;
    border-radius:6px;font-size:.74rem;font-weight:600;
    background:#DCFCE7;border:1px solid #86EFAC;color:#15803D;">
    ✅ Code Open-Source
  </div>
  <div style="display:flex;align-items:center;gap:6px;padding:4px 10px;
    border-radius:6px;font-size:.74rem;font-weight:600;
    background:#EEF2FF;border:1px solid #A5B4FC;color:#4338CA;">
    ⭐ Pareto Optimal
  </div>
</div>
"""

# ═══════════════════════════════════════════════════════════════════════════════
# Build Gradio Interface
# ═══════════════════════════════════════════════════════════════════════════════
with gr.Blocks(title="PRISM-V · Open Neural Vocoder Evaluation") as demo:

    # Load custom CSS
    css_path = os.path.join(BASE_DIR, "assets", "custom.css")
    if os.path.exists(css_path):
        with open(css_path) as f:
            gr.HTML(f"<style>{f.read()}</style>")

    # Render Header Banner
    gr.HTML(BANNER_HTML)

    # Full-Width Search Box
    with gr.Row():
        search_box = gr.Textbox(
            placeholder="🔍 Filter by model name — separate multiple terms with commas, e.g. bigvgan, vocos, comvo",
            scale=1,
            show_label=False,
            container=False,
            elem_id="search-box-full"
        )

    # ── Tabs Navigation ────────────────────────────────────────────────────────
    with gr.Tabs():

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # TAB 1 — 🏆 Leaderboard
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        with gr.TabItem("🏆 Leaderboard"):

            with gr.Column(elem_id="lb-controls-panel"):
                # Row 1: Primary Dimensions (Active Corpora + Architecture Taxonomy)
                with gr.Row(elem_classes=["ctrl-row"]):
                    with gr.Column(scale=4, min_width=260):
                        dataset_chk = gr.CheckboxGroup(
                            choices=DATASET_COLS, value=DATASET_COLS,
                            label="📂 Active Corpora (Dynamically Recomputes Avg PESQ)")
                    with gr.Column(scale=6, min_width=380):
                        arch_cat_chk = gr.CheckboxGroup(
                            choices=ARCH_CATEGORIES,
                            value=[c for c in ARCH_CATEGORIES if c != "Autoregressive"],
                            label="🏛️ Architecture Taxonomy Filter")

                # Row 2: Provenance, Track, Version & Edge Deployment
                with gr.Row(elem_classes=["ctrl-row"]):
                    with gr.Column(scale=2, min_width=130):
                        track_dd = gr.Dropdown(choices=TRACKS, value="All Tracks", label="🎯 Track")
                    with gr.Column(scale=2, min_width=120):
                        version_dd = gr.Dropdown(
                            choices=[f"Latest ({PRISM_VERSION})"], value=f"Latest ({PRISM_VERSION})",
                            label="📋 Version")
                    with gr.Column(scale=2, min_width=150):
                        code_filter = gr.Dropdown(
                            choices=["All Code", "Open-Source Code Only", "Closed-Source Only"],
                            value="All Code", label="💻 Code Availability")
                    with gr.Column(scale=2, min_width=150):
                        ckpt_filter = gr.Dropdown(
                            choices=["All Checkpoints", "Open Checkpoints Only", "Proprietary Only"],
                            value="All Checkpoints", label="📦 Checkpoint Availability")
                    with gr.Column(scale=2, min_width=150, elem_id="edge-col"):
                        edge_chk = gr.Checkbox(
                            label="⚡ Edge-feasible",
                            value=False,
                            elem_id="edge-feasible-checkbox"
                        )
                        edge_btn = gr.Button("⚡ Filter Edge", size="sm", variant="secondary", elem_id="edge-btn")

            edge_btn.click(fn=lambda cur: not cur, inputs=edge_chk, outputs=edge_chk)
            edge_chk.change(fn=lambda cur: "✅ Edge Active" if cur else "⚡ Filter Edge",
                            inputs=edge_chk, outputs=edge_btn)

            # Compact Column Visibility & Metric Customizer (Collapsible Accordion)
            with gr.Accordion("🔧 Customize Table Columns & Metrics (18 Metrics Available · Click to Expand)", open=False, elem_id="col-vis-accordion"):
                with gr.Row(elem_classes=["col-vis-row"]):
                    with gr.Column():
                        gr.Markdown("**📐 Objective Metrics**")
                        cols_obj = gr.CheckboxGroup(
                            choices=["PESQ ↑", "STOI ↑", "MCD ↓", "LSD ↓"],
                            value=["PESQ ↑", "STOI ↑"],
                            label="", elem_id="cols-obj")
                    with gr.Column():
                        gr.Markdown("**👂 Perceptual / Subjective**")
                        cols_subj = gr.CheckboxGroup(
                            choices=["UTMOS ↑", "NISQA ↑", "ΔWER ↓"],
                            value=["UTMOS ↑", "ΔWER ↓"],
                            label="", elem_id="cols-subj")
                    with gr.Column():
                        gr.Markdown("**⚡ Performance & Efficiency**")
                        cols_perf = gr.CheckboxGroup(
                            choices=["RTF ↓", "xRT ↑", "VRAM (MB) ↓", "Params (M)", "Edge ⚡"],
                            value=["RTF ↓", "xRT ↑", "VRAM (MB) ↓"],
                            label="", elem_id="cols-perf")
                    with gr.Column():
                        gr.Markdown("**🛡️ Robustness / Per-Corpus**")
                        cols_rob = gr.CheckboxGroup(
                            choices=["LJSpeech", "LibriTTS", "VCTK", "Free_ST"],
                            value=["LJSpeech", "LibriTTS", "VCTK", "Free_ST"],
                            label="", elem_id="cols-rob")
                    with gr.Column():
                        gr.Markdown("**ℹ️ Metadata & Provenance**")
                        cols_info = gr.CheckboxGroup(
                            choices=["Code", "Checkpoint", "License", "Architecture", "Track", "Year", "Pareto ⭐"],
                            value=["Code", "Checkpoint", "Pareto ⭐"],
                            label="", elem_id="cols-info")

            gr.HTML(COL_LEGEND_HTML)

            def _all_vis(o, s, p, r, i):
                return o + s + p + r + i

            init_vis = _all_vis(
                ["PESQ ↑", "STOI ↑"], ["UTMOS ↑", "ΔWER ↓"],
                ["RTF ↓", "xRT ↑", "VRAM (MB) ↓"],
                ["LJSpeech", "LibriTTS", "VCTK", "Free_ST"],
                ["Code", "Checkpoint", "Pareto ⭐"]
            )

            lb_table = gr.Dataframe(
                value=build_display_df(DF_LB, DATASET_COLS, init_vis),
                interactive=False, wrap=False, datatype="html", elem_id="prism-lb-table")

            gr.Markdown(
                "> **Code ✅** = training/inference code available publicly.  "
                "> **Checkpoint ✅** = weights freely downloadable.  "
                "> **⭐ Pareto** = non-dominated on quality and speed simultaneously.")

            def update_lb(search, datasets, track, arch_cats, edge, code_flt, ckpt_flt, dso, dss, dsp, dsr, dsi, _v):
                df = filter_df(DF_LB, search, datasets, track, arch_cats, edge, code_flt, ckpt_flt)
                vis = _all_vis(dso, dss, dsp, dsr, dsi)
                return build_display_df(df, datasets or DATASET_COLS, vis)

            lb_inputs = [
                search_box, dataset_chk, track_dd, arch_cat_chk, edge_chk,
                code_filter, ckpt_filter, cols_obj, cols_subj, cols_perf, cols_rob, cols_info, version_dd
            ]
            for w in lb_inputs:
                w.change(fn=update_lb, inputs=lb_inputs, outputs=lb_table)

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # TAB 2 — ⚖️ Compare
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        with gr.TabItem("⚖️ Compare"):
            gr.Markdown("### ⚖️ Side-by-Side Model Comparison\nSelect 2 to 4 models to directly inspect differences across quality, intelligibility, speed, and memory.")
            with gr.Row():
                cmp_models = gr.Dropdown(
                    choices=ALL_MODEL_NAMES, value=ALL_MODEL_NAMES[:3],
                    multiselect=True, max_choices=4,
                    label="Select Models to Compare (2–4)", scale=4)

            def build_compare_table(models):
                if not models: return pd.DataFrame()
                metrics = [
                    ("🏆 PRISM-V Score (1–100) ↑", "overall_score", ".1f"),
                    ("PESQ ↑",      "pesq",          ".3f"),
                    ("STOI ↑",      "stoi",          ".3f"),
                    ("UTMOS ↑",     "utmos",         ".2f"),
                    ("NISQA ↑",     "nisqa",         ".2f"),
                    ("ΔWER ↓",      "delta_wer_pct", ".2f"),
                    ("MCD ↓",       "mcd_db",        ".2f"),
                    ("RTF ↓",       "rtf",           ".4f"),
                    ("xRT ↑",       "speedup_x",     ".0f"),
                    ("VRAM (MB) ↓", "peak_vram_mb",  ".0f"),
                    ("Params (M)",  "params_m",      ".1f"),
                    ("License",     "license",       "s"),
                    ("Code OS",     "code_open",     "s"),
                    ("Ckpt OS",     "ckpt_open",     "s"),
                    ("Pareto ⭐",   "is_pareto",     "s"),
                ]
                rows = []
                for label, col, fmt in metrics:
                    row = {"Dimension": label}
                    for m in models:
                        mid = NAME_TO_ID.get(m, "")
                        r = ID_TO_ROW.get(mid, {})
                        val = r.get(col, "—")
                        if val != "—" and fmt != "s":
                            try: val = format(float(val), fmt)
                            except: val = str(val)
                        elif fmt == "s":
                            val = str(val) if val is not None else "—"
                        row[m] = val
                    rows.append(row)
                return pd.DataFrame(rows)

            cmp_table = gr.Dataframe(
                value=build_compare_table(ALL_MODEL_NAMES[:3]),
                interactive=False, label="Direct Metric Comparison")

            def _cmp_radar(models):
                fig = go.Figure()
                cats = ["PRISM-V Score", "PESQ", "STOI", "UTMOS", "ΔWER inv.", "xRT norm."]
                maxv = {"overall_score": 100, "pesq": 4.5, "stoi": 1.0, "utmos": 5.0, "delta_wer_pct": 15, "speedup_x": 400}
                colors = list(FAMILY_COLORS.values())
                for i, m in enumerate(models or []):
                    mid = NAME_TO_ID.get(m, "")
                    r = ID_TO_ROW.get(mid, {})
                    if not r: continue
                    vals = [
                        r.get("overall_score", 0) / maxv["overall_score"] * 100,
                        r.get("pesq", 0) / maxv["pesq"] * 100,
                        r.get("stoi", 0) / maxv["stoi"] * 100,
                        r.get("utmos", 0) / maxv["utmos"] * 100,
                        (1 - r.get("delta_wer_pct", 0) / maxv["delta_wer_pct"]) * 100,
                        min(r.get("speedup_x", 0) / maxv["speedup_x"] * 100, 100),
                    ]
                    c = colors[i % len(colors)]
                    fig.add_trace(go.Scatterpolar(
                        r=vals + [vals[0]], theta=cats + [cats[0]], name=m,
                        line=dict(color=c, width=2), fill="toself",
                        fillcolor=f"rgba({int(c[1:3],16)},{int(c[3:5],16)},{int(c[5:7],16)},0.12)",
                    ))
                fig.update_layout(
                    polar=dict(radialaxis=dict(visible=True, range=[0, 100])),
                    title="<b>Normalized Multi-Dimensional Radar Comparison</b> (0–100)",
                    template="plotly_white", height=500,
                    font=dict(family="Arial, sans-serif"),
                    legend=dict(orientation="h", y=-0.2, x=0.5, xanchor="center"),
                )
                return fig

            cmp_radar = gr.Plot(value=_cmp_radar(ALL_MODEL_NAMES[:3]))

            def update_compare(models):
                return build_compare_table(models), _cmp_radar(models)

            cmp_models.change(fn=update_compare, inputs=cmp_models, outputs=[cmp_table, cmp_radar])

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # TAB 3 — 🎧 Audio Explorer
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        with gr.TabItem("🎧 Audio Explorer"):
            gr.Markdown("### 🎧 Side-by-Side Audio Listening\nListen to genuine model reconstructions across diverse acoustic corpora and compare directly against ground truth reference.")
            UTT_OPTS = [(item["description"], item["tag"]) for item in ARENA]
            with gr.Row():
                utt_dd = gr.Dropdown(choices=UTT_OPTS, value=UTT_OPTS[0][1], label="📁 Utterance / Acoustic Condition", scale=4)
            with gr.Row():
                gr.Markdown("#### 🟢 Ground Truth Reference Audio")
            ref_audio = gr.Audio(label="Ground Truth Reference", type="filepath", interactive=False)

            gr.Markdown("#### ⚖️ Compare Two Vocoders")
            diff_banner = gr.HTML()

            with gr.Row():
                with gr.Column():
                    mod_a = gr.Dropdown(choices=ALL_MODEL_NAMES, value=ALL_MODEL_NAMES[0], label="Model A")
                    card_a = gr.HTML()
                    audio_a = gr.Audio(label="Model A Output", type="filepath", interactive=False)
                with gr.Column():
                    mod_b = gr.Dropdown(choices=ALL_MODEL_NAMES, value=ALL_MODEL_NAMES[1], label="Model B")
                    card_b = gr.HTML()
                    audio_b = gr.Audio(label="Model B Output", type="filepath", interactive=False)

            def get_wav(tag, model_name):
                mid = NAME_TO_ID.get(model_name, "")
                p = os.path.join(AUDIO_DIR, tag, f"{mid}.wav")
                return p if os.path.exists(p) else None

            def model_card_html(model_name):
                mid = NAME_TO_ID.get(model_name, "")
                r = ID_TO_ROW.get(mid, {})
                if not r: return ""
                links = MODEL_LINKS.get(mid, {})
                fam = r.get("architecture_family", "")
                color = FAMILY_COLORS.get(fam, "#818CF8")

                gh_btn = f'<a href="{links.get("github","#")}" target="_blank" rel="noopener noreferrer" class="audio-card-btn audio-card-btn-gh">💻 GitHub</a>' if links.get("github") else ""
                ckpt_url = links.get("checkpoint", "")
                if ckpt_url and not ckpt_url.startswith("N/A"):
                    ckpt_btn = f'<a href="{ckpt_url}" target="_blank" rel="noopener noreferrer" class="audio-card-btn audio-card-btn-ckpt">📦 Checkpoint</a>'
                else:
                    ckpt_btn = '<span style="font-size:11px;color:var(--text-muted);font-style:italic;">Algorithmic</span>'
                paper_btn = f'<a href="{links.get("paper","#")}" target="_blank" rel="noopener noreferrer" class="audio-card-btn">📄 Paper</a>' if links.get("paper") else ""

                return f"""
                <div class="vocoder-card">
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                    <span class="vocoder-card-tag" style="background:{color}22;color:{color};border:1px solid {color}55;">
                      {fam}
                    </span>
                    <span style="font-size:11.5px;color:var(--text-muted);font-weight:600;">{r.get("track","")} · Year {int(r.get("year", 2024))}</span>
                  </div>

                  <div class="vocoder-metrics-grid">
                    <div class="vocoder-metric-box">
                      <div class="vocoder-metric-lbl">Wideband PESQ</div>
                      <div class="vocoder-metric-val" style="color:var(--prism);">{r.get("pesq",0):.3f}</div>
                    </div>
                    <div class="vocoder-metric-box">
                      <div class="vocoder-metric-lbl">UTMOS MOS</div>
                      <div class="vocoder-metric-val" style="color:var(--violet);">{r.get("utmos",0):.2f}</div>
                    </div>
                    <div class="vocoder-metric-box">
                      <div class="vocoder-metric-lbl">Throughput</div>
                      <div class="vocoder-metric-val" style="color:var(--amber);">{r.get("speedup_x",0):.0f}× <span style="font-size:10px;color:var(--text-muted);">({r.get("rtf",0):.4f})</span></div>
                    </div>
                    <div class="vocoder-metric-box">
                      <div class="vocoder-metric-lbl">VRAM / Params</div>
                      <div class="vocoder-metric-val" style="color:var(--green);">{r.get("peak_vram_mb",0):.0f} MB <span style="font-size:10px;color:var(--text-muted);">({r.get("params_m",0):.1f}M)</span></div>
                    </div>
                  </div>

                  <div class="vocoder-card-actions">
                    {gh_btn}
                    {ckpt_btn}
                    {paper_btn}
                  </div>
                </div>
                """

            def compute_diff_banner(ma, mb):
                ra = ID_TO_ROW.get(NAME_TO_ID.get(ma, ""), {})
                rb = ID_TO_ROW.get(NAME_TO_ID.get(mb, ""), {})
                if not ra or not rb: return ""
                d_pesq = rb.get("pesq", 0) - ra.get("pesq", 0)
                ratio_xrt = (ra.get("speedup_x", 1) / max(1, rb.get("speedup_x", 1))) if rb.get("speedup_x", 0) > 0 else 1.0

                pesq_lead = mb if d_pesq > 0 else ma
                pesq_diff = abs(d_pesq)
                speed_lead = ma if ra.get("speedup_x", 0) >= rb.get("speedup_x", 0) else mb
                speed_factor = max(ratio_xrt, 1/ratio_xrt if ratio_xrt > 0 else 1)

                return f"""
                <div class="compare-diff-banner">
                  <div style="font-weight:700;font-size:12.5px;margin-bottom:6px;color:var(--text-primary);">
                    📊 Head-to-Head Comparison:
                  </div>
                  <div style="display:flex;flex-wrap:wrap;gap:18px;font-size:12px;color:var(--text-secondary);">
                    <div>🏆 <b>Quality:</b> <b style="color:var(--text-primary);">{pesq_lead}</b> leads PESQ by <code style="color:var(--prism);font-weight:700;">+{pesq_diff:.3f}</code></div>
                    <div>⚡ <b>Throughput:</b> <b style="color:var(--text-primary);">{speed_lead}</b> is <code style="color:var(--amber);font-weight:700;">{speed_factor:.1f}×</code> faster</div>
                    <div>💾 <b>Peak GPU Memory:</b> <b>{ma}</b> uses <code>{ra.get('peak_vram_mb',0):.0f} MB</code> vs <b>{mb}</b> <code>{rb.get('peak_vram_mb',0):.0f} MB</code></div>
                  </div>
                </div>
                """

            def update_arena(tag, ma, mb):
                ref_p = os.path.join(AUDIO_DIR, tag, "ground_truth.wav")
                ref_p = ref_p if os.path.exists(ref_p) else None
                return ref_p, compute_diff_banner(ma, mb), get_wav(tag, ma), model_card_html(ma), get_wav(tag, mb), model_card_html(mb)

            arena_in  = [utt_dd, mod_a, mod_b]
            arena_out = [ref_audio, diff_banner, audio_a, card_a, audio_b, card_b]
            for w in arena_in:
                w.change(fn=update_arena, inputs=arena_in, outputs=arena_out)
            demo.load(fn=update_arena,
                      inputs=[gr.State(UTT_OPTS[0][1]), gr.State(ALL_MODEL_NAMES[0]), gr.State(ALL_MODEL_NAMES[1])],
                      outputs=arena_out)

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # TAB 4 — 📊 Quality & Robustness
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        with gr.TabItem("📊 Quality & Robustness"):
            gr.Markdown("### 📊 Cross-Corpus Robustness & Generalization Analysis\nEvaluates degradation across clean studio (LJSpeech), multi-speaker (LibriTTS), regional accents (VCTK), and mobile noisy recordings (Free_ST).")
            with gr.Row():
                rob_metric = gr.Radio(
                    choices=[("PESQ ↑", "pesq"), ("STOI ↑", "stoi"),
                             ("LSD (dB) ↓", "lsd_db"), ("MCD (dB) ↓", "mcd_db")],
                    value="pesq", label="Select Analysis Metric")
                rob_view = gr.Radio(choices=["Heatmap", "Grouped Bar Chart"], value="Heatmap", label="Chart View")

            rob_plot = gr.Plot(value=make_dataset_heatmap(DF_DS, "pesq"))

            def update_rob(metric, view):
                return make_dataset_heatmap(DF_DS, metric) if view == "Heatmap" else make_dataset_bar(DF_DS, metric)

            rob_metric.change(fn=update_rob, inputs=[rob_metric, rob_view], outputs=rob_plot)
            rob_view.change(fn=update_rob, inputs=[rob_metric, rob_view], outputs=rob_plot)

            gr.Markdown("### Cross-Corpus Numerical Breakdown Table")
            gr.Dataframe(
                value=DF_DS[["model_name", "dataset", "pesq", "stoi", "lsd_db", "mcd_db"]].rename(
                    columns={"model_name": "Model", "dataset": "Corpus", "pesq": "PESQ",
                             "stoi": "STOI", "lsd_db": "LSD (dB)", "mcd_db": "MCD (dB)"}),
                interactive=False)

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # TAB 5 — ⚡ Efficiency
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        with gr.TabItem("⚡ Efficiency"):
            gr.Markdown(
                "### ⚡ Throughput, Latency & GPU Memory Footprint\n"
                "All benchmarks run under an **Edge Profiling** protocol using generator-only batch-size 1 FP32 inference with synchronous CUDA timing.\n\n"
                "- **RTF (Real-Time Factor)**: Compute time / Audio duration. Lower is faster.\n"
                "- **xRT (Throughput)**: Audio seconds generated per second of processing. Higher is faster.")

            eff_plot = gr.Plot(value=make_efficiency_bar())

            gr.Markdown("### Full Computational Profile Table")
            eff_df = DF_LB[["model_name", "architecture_family", "rtf", "speedup_x", "peak_vram_mb", "params_m", "edge_feasible", "code_open", "ckpt_open"]].copy()
            eff_df["speedup_x"] = eff_df["speedup_x"].apply(lambda x: f"{x:.0f}×")
            eff_df["rtf"] = eff_df["rtf"].apply(lambda x: f"{x:.4f}")
            eff_df["peak_vram_mb"] = eff_df["peak_vram_mb"].apply(lambda x: f"{x:.0f}")
            eff_df["params_m"] = eff_df["params_m"].apply(lambda x: f"{x:.1f}")
            gr.Dataframe(
                value=eff_df.rename(columns={
                    "model_name": "Model", "architecture_family": "Architecture",
                    "rtf": "RTF ↓", "speedup_x": "xRT ↑", "peak_vram_mb": "Peak VRAM (MB) ↓",
                    "params_m": "Params (M)", "edge_feasible": "Edge Ready",
                    "code_open": "Code OS", "ckpt_open": "Ckpt OS"}),
                interactive=False)

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # TAB 6 — 🧠 Architectures
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        with gr.TabItem("🧠 Architectures"):
            gr.Markdown(
                "### 🧠 Architecture-Aware Taxonomy & Comparison\n"
                "Examine differences between generative paradigms: GAN, Flow Matching, Fourier / Transformer, Diffusion SDE, and Algorithmic baselines.")
            with gr.Row():
                arch_view_cats = gr.CheckboxGroup(
                    choices=ARCH_CATEGORIES,
                    value=[c for c in ARCH_CATEGORIES if c != "Autoregressive"],
                    label="Filter Architecture Paradigms")

            def arch_table(cats):
                df = DF_LB.copy()
                if cats:
                    def has_arch(mid):
                        tags = MODEL_ARCH_TAGS.get(mid, set())
                        return any(c in tags for c in cats)
                    df = df[df["model_id"].apply(has_arch)]
                df["code_open"] = df["code_open"].fillna("—")
                df["ckpt_open"] = df["ckpt_open"].fillna("—")
                df["arch_cat"]  = df["arch_category"]
                return df[["model_name", "arch_cat", "architecture_family", "params_m",
                           "track", "year", "license", "code_open", "ckpt_open",
                           "pesq", "utmos", "rtf", "speedup_x", "peak_vram_mb", "overall_score"]].rename(
                    columns={"model_name": "Model", "arch_cat": "Category",
                             "architecture_family": "Family", "params_m": "Params (M)",
                             "track": "Track", "year": "Year", "license": "License",
                             "code_open": "Code", "ckpt_open": "Checkpoint",
                             "pesq": "PESQ", "utmos": "UTMOS", "rtf": "RTF",
                             "speedup_x": "xRT", "peak_vram_mb": "VRAM (MB)",
                             "overall_score": "Score"})

            arch_tbl = gr.Dataframe(value=arch_table([c for c in ARCH_CATEGORIES if c != "Autoregressive"]), interactive=False)
            arch_view_cats.change(fn=arch_table, inputs=arch_view_cats, outputs=arch_tbl)

            gr.Markdown("### Mean PESQ Across Architectural Paradigms")
            def arch_family_bar():
                g = DF_LB.groupby("arch_category").agg(
                    pesq_mean=("pesq", "mean"), utmos_mean=("utmos", "mean"),
                    rtf_min=("rtf", "min"), n=("model_name", "count")).reset_index()
                fig = go.Figure()
                for cat in sorted(g["arch_category"].unique()):
                    row = g[g["arch_category"] == cat]
                    c = ARCH_CAT_COLORS.get(cat, "#4F46E5")
                    fig.add_trace(go.Bar(
                        name=cat, x=[cat], y=[row["pesq_mean"].values[0]],
                        marker_color=c, text=[f"{row['pesq_mean'].values[0]:.3f}"],
                        textposition="outside",
                    ))
                fig.update_layout(
                    title="<b>Mean Wideband PESQ by Architecture Category</b>",
                    yaxis_title="Mean PESQ ↑", template="plotly_white",
                    font=dict(family="Arial, sans-serif"),
                    showlegend=False, height=400,
                )
                return fig
            gr.Plot(value=arch_family_bar())

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # TAB 7 — 🔬 Diagnostics
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        with gr.TabItem("🔬 Diagnostics"):
            gr.Markdown(
                "### 🔬 Montreal Forced Aligner Phoneme Diagnostics\n"
                "Decomposes reconstruction error across standard ARPAbet phonetic classes: Vowels, Stops, Fricatives, Affricates, Nasals, Liquids, and Glides.")
            with gr.Row():
                radar_models = gr.Dropdown(
                    choices=ALL_MODEL_NAMES, value=ALL_MODEL_NAMES[:5],
                    multiselect=True, label="Models to Display on Radar Chart", scale=4)

            radar_plot = gr.Plot(value=make_radar(DF_PHONE, ALL_MODEL_NAMES[:5]))
            radar_models.change(fn=lambda m: make_radar(DF_PHONE, m), inputs=radar_models, outputs=radar_plot)

            ph_metric = gr.Radio(
                choices=[("LSD (dB) ↓", "lsd_db"), ("Boundary Error (dB)", "boundary_error_db"),
                         ("F0 Error (cents)", "f0_error_cents")],
                value="lsd_db", label="Diagnostic Metric")
            ph_bar = gr.Plot(value=make_phoneme_bar(DF_PHONE, "lsd_db"))
            ph_metric.change(fn=lambda m: make_phoneme_bar(DF_PHONE, m), inputs=ph_metric, outputs=ph_bar)

            with gr.Accordion("📋 Full Phoneme Diagnostics Data Table", open=False):
                gr.Dataframe(
                    value=DF_PHONE[["model_name", "phonetic_class", "lsd_db", "f0_error_cents", "boundary_error_db"]].rename(
                        columns={"model_name": "Model", "phonetic_class": "Phoneme Class",
                                 "lsd_db": "LSD (dB)", "f0_error_cents": "F0 Error (¢)",
                                 "boundary_error_db": "Boundary Error (dB)"}),
                    interactive=False)

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # TAB 8 — 📈 Pareto Frontier
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        with gr.TabItem("📈 Pareto Frontier"):
            gr.Markdown(
                "### 📈 Multi-Objective Quality vs. Efficiency Pareto Frontier\n"
                "Models located on the dashed **Pareto frontier ⭐** are not dominated by any other checkpoint simultaneously on quality and resource constraints.")
            with gr.Row():
                px_col = gr.Dropdown(
                    choices=[("RTF (latency)", "rtf"), ("Peak VRAM (MB)", "peak_vram_mb"), ("Params (M)", "params_m")],
                    value="rtf", label="X-axis (Resource Cost)", scale=2)
                py_col = gr.Dropdown(
                    choices=[("🏆 PRISM-V Score (1–100)", "overall_score"), ("PESQ", "pesq"),
                             ("UTMOS", "utmos"), ("STOI", "stoi"), ("ΔWER %", "delta_wer_pct")],
                    value="overall_score", label="Y-axis (Evaluation Metric)", scale=2)
                log_x  = gr.Checkbox(label="Log X-axis", value=True, scale=1)
                pf_chk = gr.Checkbox(label="Highlight Pareto Frontier", value=True, scale=1)

            pareto_plot = gr.Plot(value=make_pareto_plot(DF_LB, "rtf", "overall_score", True, True))
            for w in [px_col, py_col, log_x, pf_chk]:
                w.change(fn=lambda x, y, lx, pf: make_pareto_plot(DF_LB, x, y, lx, pf),
                         inputs=[px_col, py_col, log_x, pf_chk], outputs=pareto_plot)

            gr.Markdown("""
| 🖥️ Deployment Target | ✅ Recommended Models | 💡 Engineering Rationale |
|---|---|---|
| **Edge / Embedded** | **Vocos**, FreeV, ComVo-Base | RTF < 0.015 (66×+ real-time), VRAM < 650 MB |
| **Mid-range GPU Server** | **Flow2GAN**, ComVo-Large | SOTA fidelity at 12–19× real-time throughput |
| **High-End Cloud / Offline** | **BigVGAN-v2 (112M)**, PeriodWave | Uncompromised reconstruction quality |
""")

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # TAB 9 — 📦 Models
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        with gr.TabItem("📦 Models"):
            gr.Markdown("### 📦 Model Registry, Provenance & Checkpoint Cards\nSelect a model to view full architectural details, official code links, checkpoint sources, and per-corpus breakdown.")
            with gr.Row():
                card_model_dd = gr.Dropdown(
                    choices=ALL_MODEL_NAMES, value=ALL_MODEL_NAMES[0],
                    label="Select Model", scale=2)

            model_card_md = gr.Markdown()

            def render_model_card(model_name):
                mid = NAME_TO_ID.get(model_name, "")
                r = ID_TO_ROW.get(mid, {})
                if not r: return "*Model not found.*"
                links = MODEL_LINKS.get(mid, {})
                os_st = MODEL_OS_STATUS.get(mid, {})
                arch_cat = MODEL_ARCH_CATEGORY.get(mid, "—")
                paper_link  = f"[📄 Paper]({links.get('paper','#')})"  if links.get("paper") else ""
                ckpt_link   = f"[🔗 Checkpoint]({links.get('checkpoint','#')})" if links.get("checkpoint") else ""
                gh_link     = f"[💻 GitHub]({links.get('github','#')})" if links.get("github") else ""
                code_badge  = "✅ Open-Source Code" if os_st.get("code_open") else "❌ Closed-Source Code"
                ckpt_badge  = "✅ Open Checkpoint" if os_st.get("ckpt_open") else "❌ Proprietary Checkpoint"
                ds_rows = DF_DS[DF_DS["model_id"] == mid]
                ds_section = ""
                for d in DATASET_COLS:
                    row_ds = ds_rows[ds_rows["dataset"] == d]
                    if not row_ds.empty:
                        ds_section += f"| {d} | `{row_ds['pesq'].values[0]:.3f}` | `{row_ds['stoi'].values[0]:.3f}` |\n"
                return f"""
## {r.get('model_name','')} &nbsp; `{mid}`

**{r.get('architecture_family','')}** · {arch_cat} · {r.get('track','')} · Year: {r.get('year','')}

{paper_link} &nbsp; {ckpt_link} &nbsp; {gh_link}

| Specification | Value |
|---|---|
| **Code Availability** | {code_badge} |
| **Checkpoint Status** | {ckpt_badge} |
| **Official License** | `{r.get('license','—')}` |
| **Sampling Rate** | `{r.get('sampling_rate_hz', 24000)} Hz` |

---

### Objective & Perceptual Quality
| Metric | Measurement |
|---|---|
| **🏆 PRISM-V Score (1–100) ↑** | `{r.get('overall_score',0):.1f} / 100` |
| **Wideband PESQ ↑** | `{r.get('pesq',0):.3f}` |
| **STOI Intelligibility ↑** | `{r.get('stoi',0):.3f}` |
| **UTMOS Neural MOS ↑** | `{r.get('utmos',0):.2f}` |
| **ASR Degradation (ΔWER) ↓** | `{r.get('delta_wer_pct',0):.2f}%` |

### Efficiency — Edge Profiling
| Metric | Measurement |
|---|---|
| **Real-Time Factor (RTF) ↓** | `{r.get('rtf',0):.4f}` |
| **Throughput (xRT) ↑** | `{r.get('speedup_x',0):.0f}×` |
| **Peak GPU VRAM ↓** | `{r.get('peak_vram_mb',0):.0f} MB` |
| **Model Parameters** | `{r.get('params_m',0):.1f} M` |
| **Edge Feasible** | `{r.get('edge_feasible','—')}` |

### Per-Corpus Breakdown
| Corpus | PESQ | STOI |
|---|---|---|
{ds_section}
| **Pareto Optimal** | `{'⭐ Yes' if r.get('is_pareto') else 'No'}` |
"""
            demo.load(fn=lambda: render_model_card(ALL_MODEL_NAMES[0]), outputs=model_card_md)
            card_model_dd.change(fn=render_model_card, inputs=card_model_dd, outputs=model_card_md)

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # TAB 10 — 🧪 Methodology (Evaluation Protocol Hidden Behind Accordion)
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        with gr.TabItem("🧪 Methodology"):
            gr.Markdown("### 🧪 Benchmark Protocol & Metric Definitions\nExpand the sections below to inspect the evaluation setup, dataset partitions, and hardware profile.")
            if LOGO_DATA_URI:
                gr.HTML(f"""
                <div style="text-align:center;margin:16px auto 24px;display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;">
                  <img src="{LOGO_DATA_URI}" alt="PRISM-V Evaluation Taxonomy" style="width:100%;max-width:540px;display:block;margin:0 auto;border-radius:14px;box-shadow:var(--shadow-lg);border:1.5px solid var(--border-2);background:#FFFFFF;padding:8px;" />
                  <p style="font-size:0.84rem;color:var(--text-secondary);margin-top:10px;font-family:Arial,sans-serif;text-align:center;max-width:680px;margin-left:auto;margin-right:auto;">
                    <b>Figure 1: <span class="prism-p">P</span><span class="prism-r">R</span><span class="prism-i">I</span><span class="prism-s">S</span><span class="prism-m">M</span>-V Evaluation Taxonomy</b> — Refracting neural vocoder synthesis across the 5 core PRISM dimensions: <b>P</b>erceptual quality, <b>R</b>econstruction fidelity, <b>I</b>ntelligibility preservation, <b>S</b>peaker preservation, and <b>M</b>odel efficiency.
                  </p>
                </div>
                """)
            with gr.Accordion("📖 Evaluation Protocol (Click to Expand)", open=False):
                gr.Markdown(METHODOLOGY_MD)
            with gr.Accordion("📐 Metric Definitions & Qualitative Interpretations", open=False):
                rows_m = []
                for k, (name, direction, desc) in METRIC_DEFS.items():
                    rows_m.append({"Metric": name, "Direction": direction, "Description": desc})
                gr.Dataframe(pd.DataFrame(rows_m), interactive=False)

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # TAB 11 — ➕ Submit Model
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        with gr.TabItem("➕ Submit Model"):
            gr.Markdown(f"""
## ➕ Submit / Request a Pretrained Vocoder

We welcome vocoder authors and researchers to submit new pretrained models to PRISM-V.

### Requirements
1. **Publicly Accessible Checkpoint**: Hugging Face Hub, Zenodo, or GitHub release.
2. **Open Inference Code**: Open-source license (MIT, Apache-2.0, BSD, CC-BY).
3. **Mel Conditioning**: Evaluated with official frontend adapters.

### PRISM-V Adapter Interface
```python
from benchmark.adapters.base import BaseVocoderAdapter
import torch

class MyVocoderAdapter(BaseVocoderAdapter):
    def load(self, device, precision):
        self.model = load_my_model(self.checkpoint_path).to(device).eval()

    def preprocess(self, waveform: torch.Tensor, sr: int) -> torch.Tensor:
        return my_mel_extractor(waveform, sr)

    @torch.no_grad()
    def infer(self, condition: torch.Tensor, seed: int) -> torch.Tensor:
        return self.model(condition)
```

### Pull Request Submission
Submit a PR to the [PRISM-V Benchmark Repository]({GITHUB_URL}) including model metadata, adapter wrapper, and preflight smoke test logs.
""")

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # TAB 12 — 📜 Changelog & Citation
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        with gr.TabItem("📜 Changelog & Citation"):
            gr.Markdown("### 📙 Citation\nIf you use the PRISM-V benchmark, evaluated checkpoints, or code in your research, please cite:")
            gr.Code(value=BIBTEX, language="latex", label="BibTeX Citation (Click top-right icon to copy)")
            gr.Markdown("---")
            gr.Markdown(CHANGELOG_MD)

    # ── Footer ─────────────────────────────────────────────────────────────────
    gr.HTML(f"""
<div style="text-align:center;padding:26px 0 14px;color:var(--text-muted,#94a3b8);
  font-size:.8rem;border-top:1px solid var(--border,#e2e8f0);margin-top:34px;
  font-family:Arial,sans-serif;">
  <strong class="prism-rainbow-text"><span class="prism-p">P</span><span class="prism-r">R</span><span class="prism-i">I</span><span class="prism-s">S</span><span class="prism-m">M</span><span class="prism-suffix" style="color:var(--prism,#4f46e5);">-V</span></strong>
  &mdash; Open Neural Vocoder Evaluation &mdash; Benchmark {PRISM_VERSION}
  &bull; Built with
  <a href="https://gradio.app" style="color:var(--prism,#4f46e5);text-decoration:none;">Gradio</a>
  &amp;
  <a href="https://huggingface.co/spaces" style="color:var(--prism,#4f46e5);text-decoration:none;">Hugging Face Spaces</a>
</div>
""")

if __name__ == "__main__":
    css_content = ""
    if os.path.exists(css_path):
        with open(css_path) as f:
            css_content = f.read()

    fav_path = os.path.join(BASE_DIR, "assets", "logo_web.png")
    if not os.path.exists(fav_path):
        fav_path = os.path.join(BASE_DIR, "logo.png")

    demo.launch(
        head=DARK_MODE_JS,
        css=css_content,
        favicon_path=fav_path if os.path.exists(fav_path) else None,
        theme=gr.themes.Soft(
            primary_hue="indigo",
            secondary_hue="cyan",
            neutral_hue="slate",
            font=["Arial", "sans-serif"],
            font_mono=[gr.themes.GoogleFont("IBM Plex Mono"), "monospace"],
        )
    )

"""
utils_display.py — Open Neural Vocoder Leaderboard
Formatting helpers and Plotly chart builders.
"""

import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
from constants import FAMILY_COLORS


def medal(rank: int) -> str:
    return {1: "🥇 1", 2: "🥈 2", 3: "🥉 3"}.get(rank, str(rank))


def format_edge(val: str) -> str:
    return "✅ Edge Ready" if val == "Yes" else "❌ High-VRAM"


def format_pareto(val) -> str:
    if val is True or str(val).lower() in ("true", "1"):
        return "⭐ Pareto"
    return "—"


def make_pareto_scatter(df: pd.DataFrame, x_col: str, y_col: str,
                        log_x: bool, show_pareto: bool) -> go.Figure:
    fig = go.Figure()
    for fam in df["architecture_family"].unique():
        sub = df[df["architecture_family"] == fam]
        color = FAMILY_COLORS.get(fam, "#6366f1")
        hover = [
            f"<b>{r['model_name']}</b><br>"
            f"Arch: {r['architecture_family']}<br>"
            f"PESQ: {r['pesq']:.3f}  UTMOS: {r['utmos']:.2f}<br>"
            f"RTF: {r['rtf']:.4f} ({r['speedup_x']:.0f}× RT)<br>"
            f"VRAM: {r['peak_vram_mb']:.0f} MB  Params: {r['params_m']:.1f}M"
            for _, r in sub.iterrows()
        ]
        fig.add_trace(go.Scatter(
            x=sub[x_col], y=sub[y_col],
            mode="markers+text", name=fam,
            text=sub["model_name"], textposition="top center",
            textfont=dict(size=9, color="#374151"),
            hovertext=hover, hoverinfo="text",
            marker=dict(size=13, color=color, opacity=0.88,
                        line=dict(width=1.5, color="#fff")),
        ))
    if show_pareto:
        pf = df[df["is_pareto"] == True].sort_values(x_col)
        if len(pf) > 1:
            fig.add_trace(go.Scatter(
                x=pf[x_col], y=pf[y_col], mode="lines",
                name="Pareto Frontier",
                line=dict(color="#dc2626", width=2.5, dash="dash"),
                hoverinfo="skip",
            ))
    axis_labels = {
        "rtf":          "Real-Time Factor (↓ lower = faster)",
        "peak_vram_mb": "Peak VRAM (MB)",
        "params_m":     "Generator Params (M)",
        "pesq":         "PESQ (↑ higher = better)",
        "utmos":        "UTMOS (↑ higher = better)",
        "stoi":         "STOI (↑ higher = better)",
        "overall_score":"Composite Score (↑ higher = better)",
        "delta_wer_pct":"ΔWER % (↓ lower = better)",
    }
    fig.update_layout(
        title=f"<b>{axis_labels.get(y_col, y_col)}</b> vs <b>{axis_labels.get(x_col, x_col)}</b>",
        xaxis_title=axis_labels.get(x_col, x_col),
        yaxis_title=axis_labels.get(y_col, y_col),
        xaxis_type="log" if log_x and x_col in ("rtf", "params_m") else "linear",
        template="plotly_white", hovermode="closest", height=560,
        legend=dict(orientation="h", y=-0.35, x=0.5, xanchor="center", font=dict(size=10)),
        margin=dict(l=60, r=40, t=55, b=120),
    )
    return fig


def make_radar(df_phone: pd.DataFrame, models: list) -> go.Figure:
    cats = ["Vowels", "Stops / Plosives", "Fricatives",
            "Affricates", "Nasals", "Liquids", "Glides"]
    colors = list(FAMILY_COLORS.values())
    fig = go.Figure()
    for i, m in enumerate(models):
        sub = df_phone[df_phone["model_name"] == m]
        if sub.empty:
            continue
        vm = dict(zip(sub["phonetic_class"], sub["lsd_db"]))
        r = [vm.get(c, 0) for c in cats] + [vm.get(cats[0], 0)]
        c = colors[i % len(colors)]
        fig.add_trace(go.Scatterpolar(
            r=r, theta=cats + [cats[0]], name=m,
            line=dict(color=c, width=2),
            fill="toself",
            fillcolor=f"rgba({int(c[1:3],16)},{int(c[3:5],16)},{int(c[5:7],16)},0.10)",
        ))
    max_lsd = df_phone["lsd_db"].max() if not df_phone.empty else 15.0
    fig.update_layout(
        polar=dict(radialaxis=dict(visible=True, range=[0, max_lsd * 1.18],
                                   title="LSD (dB) ↓")),
        title="<b>Phoneme-Resolved LSD (dB)</b>",
        template="plotly_white", height=500,
        legend=dict(orientation="h", y=-0.25, x=0.5, xanchor="center"),
    )
    return fig


def make_phoneme_bar(df_phone: pd.DataFrame, metric: str) -> go.Figure:
    labels = {
        "lsd_db":             "LSD (dB) ↓",
        "boundary_error_db":  "Boundary Error (dB)",
        "f0_error_cents":     "F0 Error (cents)",
    }
    fig = px.bar(
        df_phone, x="phonetic_class", y=metric, color="family", barmode="group",
        title=f"<b>Phonetic Error by Category</b> — {labels.get(metric, metric)}",
        labels={"phonetic_class": "Phonetic Class", metric: labels.get(metric, metric),
                "family": "Architecture"},
        color_discrete_map=FAMILY_COLORS, template="plotly_white",
    )
    fig.update_layout(
        height=480,
        legend=dict(orientation="h", y=-0.38, x=0.5, xanchor="center"),
    )
    return fig


def make_dataset_bar(df_ds: pd.DataFrame, metric: str) -> go.Figure:
    labels = {
        "pesq":   "PESQ ↑",
        "stoi":   "STOI ↑",
        "lsd_db": "LSD (dB) ↓",
        "mcd_db": "MCD (dB) ↓",
    }
    fig = px.bar(
        df_ds, x="model_name", y=metric, color="dataset", barmode="group",
        title=f"<b>Cross-Corpus Robustness</b> — {labels.get(metric, metric)}",
        labels={"model_name": "Model", metric: labels.get(metric, metric),
                "dataset": "Corpus"},
        color_discrete_sequence=["#3b82f6", "#10b981", "#f59e0b", "#ec4899"],
        template="plotly_white",
    )
    fig.update_layout(
        xaxis_tickangle=-40, height=500,
        legend=dict(orientation="h", y=-0.35, x=0.5, xanchor="center"),
    )
    return fig

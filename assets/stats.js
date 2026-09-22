/**
 * PRISM-V Statistical Evidence & Inferential Analysis Module
 * Source of truth: web_data/website_stats.json, pairwise_105_holm.csv, bootstrap_display_first_1000.csv
 */
(() => {
  'use strict';

  // ── Module State ─────────────────────────────────────────────────────────────
  const statsState = {
    data: window.PRISM_STATS || null,
    bootstrap1000: window.PRISM_BOOTSTRAP_1000 || null,
    matrices: window.PRISM_MATRICES || null,
    filterMode: 'all', // 'all' | 'neural'
    forestMode: 'ci', // 'ci' (Observed + 95% CI) | 'sd' (Mean ± SD)
    matrixMode: 'full', // 'full' (15x15) | 'triangle' (upper only)
    activeModel: 'rndvoc',
    comparisonModel: 'flow2gan',
    comparisonModel2: 'vocos_mel_24khz',
    selectedPair: { systemA: 'rndvoc', systemB: 'flow2gan' },
    bootstrapPlotType: 'kde', // 'kde' | 'histogram' | 'violin'
    isInitialized: false,
    isLoading: false
  };

  function getTheme() {
    const isDark = document.documentElement.classList.contains('dark') ||
      (window.__PRISM_STATE__ && window.__PRISM_STATE__.theme === 'dark') ||
      (!document.documentElement.classList.contains('light'));
    return {
      isDark,
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      font: {
        family: 'Inter, -apple-system, sans-serif',
        color: isDark ? '#F8FAFC' : '#0F172A',
        size: 11
      },
      gridcolor: isDark ? '#1E293B' : '#E2E8F0',
      linecolor: isDark ? '#334155' : '#CBD5E1',
      zerolinecolor: isDark ? '#475569' : '#94A3B8'
    };
  }

  // ── Data Loading & Validation ────────────────────────────────────────────────
  async function loadData() {
    if (statsState.data && statsState.bootstrap1000) return true;
    try {
      if (!statsState.data) {
        if (window.PRISM_STATS) {
          statsState.data = window.PRISM_STATS;
        } else {
          const res = await fetch('data/stats/website_stats.json');
          if (res.ok) statsState.data = await res.json();
        }
      }
      if (!statsState.bootstrap1000) {
        if (window.PRISM_BOOTSTRAP_1000) {
          statsState.bootstrap1000 = window.PRISM_BOOTSTRAP_1000;
        } else {
          const res = await fetch('data/stats/bootstrap_1000.json');
          if (res.ok) statsState.bootstrap1000 = await res.json();
        }
      }
      return !!(statsState.data);
    } catch (e) {
      console.error('Error loading PRISM-V statistical evidence data:', e);
      return false;
    }
  }

  function getModel(id) {
    if (!statsState.data || !statsState.data.models) return null;
    return statsState.data.models.find(m => m.id === id) || null;
  }

  function getPair(sysA, sysB) {
    if (!statsState.data || !statsState.data.pairs) return null;
    if (sysA === sysB) {
      const mA = getModel(sysA);
      return {
        system_A: sysA,
        system_B: sysB,
        label_A: mA ? mA.label : sysA,
        label_B: mA ? mA.label : sysB,
        score_A: mA ? mA.score : 0,
        score_B: mA ? mA.score : 0,
        effect_A_minus_B: 0,
        effect_se: 0,
        effect_ci95: [0, 0],
        p_raw: 1.0,
        p_holm: 1.0,
        holm_significant_0_05: false,
        isSelf: true
      };
    }

    const pair = statsState.data.pairs.find(p => p.system_A === sysA && p.system_B === sysB);
    if (pair) {
      return { ...pair, isSelf: false };
    }

    const rev = statsState.data.pairs.find(p => p.system_A === sysB && p.system_B === sysA);
    if (rev) {
      return {
        system_A: sysA,
        system_B: sysB,
        label_A: rev.label_B,
        label_B: rev.label_A,
        score_A: rev.score_B,
        score_B: rev.score_A,
        effect_A_minus_B: -rev.effect_A_minus_B,
        effect_se: rev.effect_se,
        effect_ci95: [-rev.effect_ci95[1], -rev.effect_ci95[0]],
        p_raw: rev.p_raw,
        p_holm: rev.p_holm,
        holm_significant_0_05: rev.holm_significant_0_05,
        isSelf: false
      };
    }
    return null;
  }

  // ── Formatters ───────────────────────────────────────────────────────────────
  function formatPValue(p) {
    if (p === null || p === undefined) return '—';
    if (p < 0.0001) return '< 0.0001';
    if (p < 0.001) return p.toFixed(4);
    return p.toFixed(4);
  }

  function formatNum(v, decimals = 2) {
    if (v === null || v === undefined || isNaN(v)) return '—';
    return Number(v).toFixed(decimals);
  }

  // ── VIEW 1: Statistical Protocol Summary ─────────────────────────────────────
  function renderProtocolSummary() {
    // Already laid out in HTML cards; verified run facts are static & exact.
  }

  // ── VIEW 2: Forest Plot Leaderboard ──────────────────────────────────────────
  function renderForestLeaderboard() {
    const el = document.getElementById('stats-forest-chart');
    if (!el || !statsState.data || !statsState.data.models) return;

    const theme = getTheme();
    let models = [...statsState.data.models];

    if (statsState.filterMode === 'neural') {
      models = models.filter(m => m.system_type === 'neural_vocoder');
    }

    // Sort ascending by score so the highest ranked is at the top of horizontal axis
    models.sort((a, b) => a.score - b.score);

    const yLabels = models.map((m, idx) => {
      const rank = statsState.filterMode === 'neural' ? (models.length - idx) : m.rank_overall;
      const isBase = m.system_type === 'algorithmic_baseline';
      const badge = isBase ? ' [Baseline]' : '';
      return `#${rank} ${m.label}${badge}`;
    });

    const isSdMode = statsState.forestMode === 'sd';

    const customdata = models.map(m => {
      const diff = m.mean_minus_observed !== undefined ? m.mean_minus_observed : (m.bootstrap_mean - m.score);
      const diffSign = diff >= 0 ? '+' : '';
      return {
        id: m.id,
        label: m.label,
        score: m.score,
        mean: m.bootstrap_mean,
        sd: m.bootstrap_sd,
        diffText: `${diffSign}${diff.toFixed(2)}`,
        ci: m.score_ci95,
        n_bootstrap: m.n_bootstrap || 10000,
        type: m.system_type === 'algorithmic_baseline' ? 'Algorithmic baseline' : 'Neural vocoder'
      };
    });

    // Tooltip adhering strictly to Section 5 precision specifications
    const hovertemplate =
      '<b>%{customdata.label}</b> (%{customdata.type})<br>' +
      'Observed PRISM-V: <b>%{customdata.score:.2f}</b><br>' +
      'Bootstrap Mean: <b>%{customdata.mean:.2f}</b><br>' +
      'Bootstrap SD: <b>%{customdata.sd:.2f}</b><br>' +
      'Mean − Observed: <b>%{customdata.diffText}</b><br>' +
      '95% Bootstrap CI: [<b>%{customdata.ci[0]:.2f}</b>, <b>%{customdata.ci[1]:.2f}</b>]<br>' +
      'Bootstrap Replicates: <b>%{customdata.n_bootstrap:,}</b><br>' +
      '<extra></extra>';

    let traces = [];

    if (!isSdMode) {
      // Default Mode: Observed Score + 95% Bootstrap CI Whisker
      const xScores = models.map(m => m.score);
      const xErrorsMinus = models.map(m => m.score - m.score_ci95[0]);
      const xErrorsPlus = models.map(m => m.score_ci95[1] - m.score);

      const markerColors = models.map(m => {
        if (m.id === statsState.activeModel) return '#818CF8'; // Active highlight (indigo)
        if (m.system_type === 'algorithmic_baseline') return '#94A3B8'; // Baseline (slate)
        return '#38BDF8'; // Standard neural (sky)
      });

      traces.push({
        type: 'scatter',
        mode: 'markers',
        name: 'Observed + 95% CI',
        x: xScores,
        y: yLabels,
        customdata: customdata,
        error_x: {
          type: 'data',
          symmetric: false,
          array: xErrorsPlus,
          arrayminus: xErrorsMinus,
          color: theme.isDark ? '#64748B' : '#94A3B8',
          thickness: 2,
          width: 6
        },
        marker: {
          size: 9,
          color: markerColors,
          line: { color: theme.isDark ? '#0F172A' : '#FFFFFF', width: 1.5 }
        },
        hovertemplate: hovertemplate
      });
    } else {
      // Mean ± SD Mode: Show Bootstrap Mean with ±SD Whisker (ddof=1) while retaining Observed Score
      const xMeans = models.map(m => m.bootstrap_mean);
      const xSds = models.map(m => m.bootstrap_sd);

      traces.push({
        type: 'scatter',
        mode: 'markers',
        name: 'Bootstrap Mean ± SD (ddof=1)',
        x: xMeans,
        y: yLabels,
        customdata: customdata,
        error_x: {
          type: 'data',
          symmetric: true,
          array: xSds,
          color: '#38BDF8',
          thickness: 2,
          width: 6
        },
        marker: {
          size: 9,
          color: '#38BDF8',
          symbol: 'circle',
          line: { color: theme.isDark ? '#0F172A' : '#FFFFFF', width: 1.5 }
        },
        hovertemplate: hovertemplate
      });

      // Retained Observed Score as a distinct open diamond
      const xScores = models.map(m => m.score);
      traces.push({
        type: 'scatter',
        mode: 'markers',
        name: 'Observed PRISM-V (Score)',
        x: xScores,
        y: yLabels,
        customdata: customdata,
        marker: {
          size: 9,
          color: '#818CF8',
          symbol: 'diamond-open',
          line: { color: '#818CF8', width: 2 }
        },
        hovertemplate: hovertemplate
      });
    }

    const xAxisTitle = isSdMode
      ? '<b>Bootstrap Mean ± SD (Sample SD with ddof=1) vs Observed PRISM-V (Open Diamond)</b>'
      : '<b>Observed PRISM-V Score (with 95% Bootstrap CI Whisker)</b>';

    const layout = {
      paper_bgcolor: theme.paper_bgcolor,
      plot_bgcolor: theme.plot_bgcolor,
      font: theme.font,
      margin: { l: 190, r: 30, t: isSdMode ? 35 : 20, b: 50 },
      showlegend: isSdMode,
      legend: {
        orientation: 'h',
        x: 0,
        y: 1.08,
        font: { size: 11 }
      },
      xaxis: {
        title: { text: xAxisTitle, font: { size: 12 } },
        gridcolor: theme.gridcolor,
        linecolor: theme.linecolor,
        zeroline: false
      },
      yaxis: {
        automargin: true,
        gridcolor: theme.gridcolor,
        linecolor: theme.linecolor
      },
      hovermode: 'closest'
    };

    const config = { responsive: true, displayModeBar: false };
    Plotly.newPlot(el, traces, layout, config);

    renderValidationTable();

    el.on('plotly_click', data => {
      if (data && data.points && data.points[0]) {
        const pt = data.points[0];
        const m = pt.customdata;
        if (m && m.id) {
          setActiveModel(m.id);
        }
      }
    });
  }

  function renderValidationTable() {
    const tbody = document.getElementById('stats-val-table-body');
    if (!tbody || !statsState.data || !statsState.data.models) return;

    let models = [...statsState.data.models];
    if (statsState.filterMode === 'neural') {
      models = models.filter(m => m.system_type === 'neural_vocoder');
    }
    models.sort((a, b) => a.rank_overall - b.rank_overall);

    tbody.innerHTML = models.map((m, idx) => {
      const rank = statsState.filterMode === 'neural' ? (idx + 1) : m.rank_overall;
      const isBase = m.system_type === 'algorithmic_baseline';
      const diff = m.mean_minus_observed !== undefined ? m.mean_minus_observed : (m.bootstrap_mean - m.score);
      const diffSign = diff >= 0 ? '+' : '';
      return `
        <tr class="hover:bg-slate-800/40 transition">
          <td class="p-2 font-mono text-slate-400 font-bold">#${rank}</td>
          <td class="p-2 font-medium text-slate-200">${m.label}${isBase ? ' <span class="text-[10px] text-slate-500 font-mono">[Baseline]</span>' : ''}</td>
          <td class="p-2 font-mono text-right font-bold text-sky-400">${m.score.toFixed(2)}</td>
          <td class="p-2 font-mono text-right text-indigo-300">${m.bootstrap_mean.toFixed(2)} ± ${m.bootstrap_sd.toFixed(2)}</td>
          <td class="p-2 font-mono text-right ${Math.abs(diff) < 0.01 ? 'text-slate-400' : 'text-amber-300'}">${diffSign}${diff.toFixed(2)}</td>
          <td class="p-2 font-mono text-right text-slate-400">[${m.score_ci95[0].toFixed(2)}, ${m.score_ci95[1].toFixed(2)}]</td>
          <td class="p-2 font-mono text-right text-slate-500">${(m.n_bootstrap || 10000).toLocaleString()}</td>
        </tr>
      `;
    }).join('');
  }

  // ── VIEW 3: 15×15 Pairwise Significance Heatmap ──────────────────────────────
  function renderPairwiseHeatmap() {
    const el = document.getElementById('stats-heatmap-chart');
    if (!el || !statsState.data || !statsState.data.models) return;

    const theme = getTheme();
    const models = [...statsState.data.models];
    // Order by descending rank for upper-positive / lower-negative triangle
    models.sort((a, b) => a.rank_overall - b.rank_overall);

    const labels = models.map(m => m.label);
    const ids = models.map(m => m.id);
    const n = ids.length;

    const zMatrix = [];
    const textMatrix = [];
    const customMatrix = [];
    const annotations = [];

    const isTriangle = statsState.matrixMode === 'triangle';

    for (let i = 0; i < n; i++) {
      const rowZ = [];
      const rowText = [];
      const rowCustom = [];
      for (let j = 0; j < n; j++) {
        const sysA = ids[i];
        const sysB = ids[j];

        if (i === j) {
          // Diagonal: self-comparison with '-'
          rowZ.push(0.0);
          rowText.push('-');
          rowCustom.push({
            sysA,
            sysB,
            labelA: models[i].label,
            labelB: models[j].label,
            diff: 0,
            ci: [0, 0],
            p_raw: 1,
            p_holm: 1,
            sig: false,
            isSelf: true,
            statusDesc: '<b>Diagonal: Self-Comparison</b><br>Score Difference: <b>0.00</b> (Model compared to itself)'
          });

          annotations.push({
            x: models[j].label,
            y: models[i].label,
            text: '<b style="font-size:14px; font-family:monospace; color:' + (theme.isDark ? '#CBD5E1' : '#475569') + ';">-</b>',
            showarrow: false
          });
        } else if (isTriangle && i > j) {
          // Lower triangle in triangle mode: blank / empty
          rowZ.push(null);
          rowText.push('');
          rowCustom.push(null);
        } else {
          // Upper triangle (or full matrix)
          const p = getPair(sysA, sysB);
          const diff = p ? p.effect_A_minus_B : 0;
          const isSig = p ? p.holm_significant_0_05 : false;

          // If not significant: neutral grey (represented by z=0 on the symmetric [-15, +15] scale)
          // If significant: z = diff (blue if positive, red if negative)
          const cellZ = !isSig ? 0.0 : diff;
          rowZ.push(cellZ);
          rowText.push(diff >= 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2));

          const statusDesc = !isSig
            ? '<b>Significance: ⚠ Not Statistically Significant (ns, grey)</b><br><i>Difference within bootstrap noise (p_Holm = ' + (p ? formatPValue(p.p_holm) : '1.0') + ' > 0.05). Shaded in grey.</i>'
            : '<b>Significance: ✓ Statistically Significant</b><br><i>Resolved after Holm correction (p_Holm = ' + (p ? formatPValue(p.p_holm) : '<0.001') + ' ≤ 0.05).</i>';

          rowCustom.push({
            sysA,
            sysB,
            labelA: models[i].label,
            labelB: models[j].label,
            diff,
            ci: p ? p.effect_ci95 : [0, 0],
            p_raw: p ? p.p_raw : 1,
            p_holm: p ? p.p_holm : 1,
            sig: isSig,
            isSelf: false,
            statusDesc
          });

          // Non-significant cells get visible marker annotation 'ns' (accessibility requirement)
          if (!isSig) {
            annotations.push({
              x: models[j].label,
              y: models[i].label,
              text: '<b>ns</b>',
              showarrow: false,
              font: {
                size: 9.5,
                color: theme.isDark ? '#F59E0B' : '#B45309'
              }
            });
          }
        }
      }
      zMatrix.push(rowZ);
      textMatrix.push(rowText);
      customMatrix.push(rowCustom);
    }

    // Diverging colorscale centered at 0:
    // Symmetric range [-15, +15]:
    // Red for negative (Row < Col) -> Neutral Grey at 0 (and ns) -> Blue for positive (Row > Col)
    const divergingScale = [
      [0.0, '#B91C1C'],   // -15: Strong Red
      [0.25, '#EF4444'],  // -7.5: Red
      [0.45, '#F87171'],  // -1.5: Soft Red
      [0.499, theme.isDark ? '#334155' : '#CBD5E1'], // near 0: neutral grey
      [0.50, theme.isDark ? '#334155' : '#E2E8F0'],  // 0: neutral grey (ns and zero)
      [0.501, theme.isDark ? '#334155' : '#CBD5E1'], // near 0: neutral grey
      [0.55, '#38BDF8'],  // +1.5: Soft Sky
      [0.75, '#3B82F6'],  // +7.5: Blue
      [1.0, '#1D4ED8']    // +15: Strong Blue
    ];

    const trace = {
      type: 'heatmap',
      z: zMatrix,
      x: labels,
      y: labels,
      customdata: customMatrix,
      colorscale: divergingScale,
      zmin: -15,
      zmax: 15,
      zmid: 0,
      hoverongaps: false,
      colorbar: {
        title: { text: '<b>Δ PRISM-V (A − B)</b>', font: { size: 11, color: theme.font.color } },
        len: 0.85,
        thickness: 14,
        tickvals: [-15, -10, -5, 0, 5, 10, 15],
        ticktext: ['-15 (Red)', '-10', '-5', '0 (Grey/ns)', '+5', '+10', '+15 (Blue)'],
        tickfont: { color: theme.font.color, size: 9.5 }
      },
      hovertemplate:
        '<b>%{customdata.labelA} (Row A)</b> vs <b>%{customdata.labelB} (Col B)</b><br>' +
        'Observed Δ: <b>%{customdata.diff:+.2f}</b><br>' +
        'Paired 95% CI: [%{customdata.ci[0]:.2f}, %{customdata.ci[1]:.2f}]<br>' +
        'Raw p: %{customdata.p_raw:.4f} • Holm p: %{customdata.p_holm:.4f}<br>' +
        '%{customdata.statusDesc}' +
        '<extra></extra>'
    };

    const layout = {
      paper_bgcolor: theme.paper_bgcolor,
      plot_bgcolor: theme.plot_bgcolor,
      font: theme.font,
      margin: { l: 150, r: 40, t: 30, b: 150 },
      xaxis: {
        tickangle: -45,
        gridcolor: 'transparent',
        linecolor: theme.linecolor,
        automargin: true,
        constrain: 'domain'
      },
      yaxis: {
        autorange: 'reversed', // rank 1 at top
        scaleanchor: 'x',      // Enforce 1:1 SQUARE CELLS
        scaleratio: 1,
        gridcolor: 'transparent',
        linecolor: theme.linecolor,
        automargin: true,
        constrain: 'domain'
      },
      annotations: annotations
    };

    const config = { responsive: true, displayModeBar: false };
    Plotly.newPlot(el, [trace], layout, config);

    el.on('plotly_click', data => {
      if (data && data.points && data.points[0]) {
        const pt = data.points[0];
        const c = pt.customdata;
        if (c && c.sysA && c.sysB && !c.isSelf) {
          selectPair(c.sysA, c.sysB);
          const explorerEl = document.getElementById('stats-pair-explorer-container');
          if (explorerEl) explorerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  // ── VIEW 4: Pairwise Comparison Explorer ─────────────────────────────────────
  function renderPairwiseExplorer() {
    const { systemA, systemB } = statsState.selectedPair;
    const pair = getPair(systemA, systemB);
    const container = document.getElementById('stats-pair-scorecard');
    if (!container || !pair) return;

    const isSig = pair.holm_significant_0_05;
    const diff = pair.effect_A_minus_B;
    const [ciLow, ciHigh] = pair.effect_ci95;

    // Status badge text as per spec (avoid forbidden words)
    const statusHtml = isSig
      ? '<span class="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">✓ Significant after Holm correction</span>'
      : '<span class="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">⚠ Not statistically resolved after Holm correction</span>';

    container.innerHTML = `
      <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
        <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">System A (${pair.label_A})</div>
        <div class="text-2xl font-black text-indigo-400 font-mono mt-1">${pair.score_A.toFixed(2)}</div>
        <div class="text-[11px] text-slate-500 mt-0.5">Observed PRISM-V score</div>
      </div>
      <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
        <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">System B (${pair.label_B})</div>
        <div class="text-2xl font-black text-sky-400 font-mono mt-1">${pair.score_B.toFixed(2)}</div>
        <div class="text-[11px] text-slate-500 mt-0.5">Observed PRISM-V score</div>
      </div>
      <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
        <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Paired Effect Δ (A − B)</div>
        <div class="text-2xl font-black ${diff >= 0 ? 'text-indigo-300' : 'text-amber-300'} font-mono mt-1">${diff >= 0 ? '+' : ''}${diff.toFixed(2)}</div>
        <div class="text-[11px] text-slate-500 mt-0.5">95% CI: [${ciLow.toFixed(2)}, ${ciHigh.toFixed(2)}]</div>
      </div>
      <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Inference (α = 0.05)</div>
          <div class="mt-1 text-xs text-slate-300 font-mono">
            Raw p: <b>${formatPValue(pair.p_raw)}</b> • Holm p: <b>${formatPValue(pair.p_holm)}</b>
          </div>
        </div>
        <div class="mt-2">${statusHtml}</div>
      </div>
    `;

    renderPairForestAxis(pair);
  }

  function renderPairForestAxis(pair) {
    const el = document.getElementById('stats-pair-forest-chart');
    if (!el) return;

    const theme = getTheme();
    const diff = pair.effect_A_minus_B;
    const [ciLow, ciHigh] = pair.effect_ci95;
    const isSig = pair.holm_significant_0_05;

    const trace = {
      type: 'scatter',
      mode: 'markers',
      x: [diff],
      y: [0],
      error_x: {
        type: 'data',
        symmetric: false,
        array: [ciHigh - diff],
        arrayminus: [diff - ciLow],
        color: isSig ? '#818CF8' : '#F59E0B',
        thickness: 3,
        width: 10
      },
      marker: {
        size: 14,
        color: isSig ? '#6366F1' : '#F59E0B',
        line: { color: '#FFFFFF', width: 2 }
      },
      hovertemplate:
        '<b>Δ PRISM-V (A − B)</b>: %{x:+.2f}<br>' +
        '95% Paired CI: [' + ciLow.toFixed(2) + ', ' + ciHigh.toFixed(2) + ']<br>' +
        '<extra></extra>'
    };

    // Calculate dynamic range centered or comfortably enclosing 0 and CIs
    const maxBound = Math.max(Math.abs(ciLow), Math.abs(ciHigh), Math.abs(diff), 1.5) * 1.35;

    const layout = {
      paper_bgcolor: theme.paper_bgcolor,
      plot_bgcolor: theme.plot_bgcolor,
      font: theme.font,
      margin: { l: 20, r: 20, t: 15, b: 35 },
      xaxis: {
        range: [-maxBound, maxBound],
        zeroline: true,
        zerolinecolor: theme.isDark ? '#EF4444' : '#DC2626',
        zerolinewidth: 2,
        gridcolor: theme.gridcolor,
        linecolor: theme.linecolor,
        title: { text: '<b>Paired Difference (Δ = A − B) with 95% Bootstrap CI</b>', font: { size: 11 } }
      },
      yaxis: {
        showticklabels: false,
        showgrid: false,
        zeroline: false,
        range: [-0.5, 0.5]
      },
      shapes: [
        {
          type: 'line',
          x0: 0,
          x1: 0,
          y0: -0.4,
          y1: 0.4,
          line: {
            color: theme.isDark ? '#EF4444' : '#DC2626',
            width: 2,
            dash: 'dash'
          }
        }
      ]
    };

    const config = { responsive: true, displayModeBar: false };
    Plotly.newPlot(el, [trace], layout, config);
  }

  // ── VIEW 5: Cross-Corpus Consistency Profile ─────────────────────────────────
  function renderCorpusProfile() {
    const el = document.getElementById('stats-corpus-chart');
    if (!el || !statsState.data || !statsState.data.models) return;

    const theme = getTheme();
    const corpora = ['LJSpeech', 'LibriTTS', 'VCTK', 'Free_ST'];
    const modelIds = [statsState.activeModel, statsState.comparisonModel, statsState.comparisonModel2].filter(Boolean);
    const uniqueIds = [...new Set(modelIds)].slice(0, 3); // max 3 models

    const colors = ['#818CF8', '#38BDF8', '#34D399'];

    const traces = uniqueIds.map((id, idx) => {
      const m = getModel(id);
      if (!m || !m.corpus_utility) return null;

      const yVals = corpora.map(c => m.corpus_utility[c]);
      // Find lowest corpus utility
      let minVal = Infinity;
      let worstCorpus = '';
      corpora.forEach(c => {
        if (m.corpus_utility[c] < minVal) {
          minVal = m.corpus_utility[c];
          worstCorpus = c;
        }
      });

      const customdata = corpora.map(c => ({
        model: m.label,
        corpus: c,
        val: m.corpus_utility[c],
        worst: worstCorpus,
        isWorst: c === worstCorpus
      }));

      return {
        type: 'scatter',
        mode: 'lines+markers',
        name: m.label,
        x: corpora,
        y: yVals,
        customdata,
        line: { color: colors[idx % colors.length], width: 2.5 },
        marker: {
          size: 9,
          color: colors[idx % colors.length],
          line: { color: theme.isDark ? '#0F172A' : '#FFFFFF', width: 1.5 }
        },
        hovertemplate:
          '<b>%{customdata.model}</b><br>' +
          'Corpus: %{customdata.corpus}<br>' +
          'Utility B: <b>%{customdata.val:.4f}</b><br>' +
          '%{customdata.isWorst ? "⚠️ <b>Worst-corpus utility for this model</b>" : ""}' +
          '<extra></extra>'
      };
    }).filter(Boolean);

    const layout = {
      paper_bgcolor: theme.paper_bgcolor,
      plot_bgcolor: theme.plot_bgcolor,
      font: theme.font,
      margin: { l: 50, r: 30, t: 25, b: 40 },
      xaxis: {
        gridcolor: theme.gridcolor,
        linecolor: theme.linecolor
      },
      yaxis: {
        title: { text: '<b>Corpus Utility (B)</b>', font: { size: 11 } },
        gridcolor: theme.gridcolor,
        linecolor: theme.linecolor
      },
      legend: {
        orientation: 'h',
        x: 0,
        y: 1.12,
        font: { size: 11 }
      },
      hovermode: 'closest'
    };

    const config = { responsive: true, displayModeBar: false };
    Plotly.newPlot(el, traces, layout, config);
  }

  // ── VIEW 6: Bootstrap Uncertainty Explorer ───────────────────────────────────
  function renderBootstrapUncertainty() {
    const el = document.getElementById('stats-bootstrap-chart');
    if (!el || !statsState.bootstrap1000 || !statsState.bootstrap1000.models) return;

    const theme = getTheme();
    const primaryId = statsState.activeModel;
    const compId = statsState.comparisonModel;
    const selectedIds = [primaryId, compId && compId !== primaryId ? compId : null].filter(Boolean);

    const colors = ['#818CF8', '#38BDF8'];
    const pType = statsState.bootstrapPlotType;

    const traces = selectedIds.map((id, idx) => {
      const vals = statsState.bootstrap1000.models[id];
      const m = getModel(id);
      if (!vals || !m) return null;

      if (pType === 'violin') {
        return {
          type: 'violin',
          name: m.label,
          y: vals,
          box: { visible: true },
          meanline: { visible: true },
          line: { color: colors[idx % colors.length] },
          fillcolor: idx === 0 ? 'rgba(129, 140, 248, 0.25)' : 'rgba(56, 189, 248, 0.25)'
        };
      } else if (pType === 'histogram') {
        return {
          type: 'histogram',
          name: m.label,
          x: vals,
          opacity: 0.7,
          marker: { color: colors[idx % colors.length] }
        };
      } else {
        // KDE / Smooth density approximation
        const sorted = [...vals].sort((a, b) => a - b);
        const min = sorted[0];
        const max = sorted[sorted.length - 1];
        const nPoints = 60;
        const step = (max - min) / nPoints;
        const xKde = [];
        const yKde = [];
        // Scott's rule bandwidth approx
        const h = 1.06 * 0.4 * Math.pow(vals.length, -0.2);

        for (let i = 0; i <= nPoints; i++) {
          const x = min + i * step;
          let sum = 0;
          for (let j = 0; j < vals.length; j++) {
            const u = (x - vals[j]) / h;
            sum += Math.exp(-0.5 * u * u) / (h * Math.sqrt(2 * Math.PI));
          }
          xKde.push(x);
          yKde.push(sum / vals.length);
        }

        return {
          type: 'scatter',
          mode: 'lines',
          name: m.label,
          x: xKde,
          y: yKde,
          fill: 'tozeroy',
          line: { color: colors[idx % colors.length], width: 2 },
          fillcolor: idx === 0 ? 'rgba(129, 140, 248, 0.22)' : 'rgba(56, 189, 248, 0.22)'
        };
      }
    }).filter(Boolean);

    const layout = {
      paper_bgcolor: theme.paper_bgcolor,
      plot_bgcolor: theme.plot_bgcolor,
      font: theme.font,
      margin: { l: 50, r: 30, t: 25, b: 40 },
      xaxis: {
        title: { text: pType === 'violin' ? '' : '<b>PRISM-V Score (1,000 Draws)</b>', font: { size: 11 } },
        gridcolor: theme.gridcolor,
        linecolor: theme.linecolor
      },
      yaxis: {
        title: { text: pType === 'violin' ? '<b>Score</b>' : '<b>Density / Frequency</b>', font: { size: 11 } },
        gridcolor: theme.gridcolor,
        linecolor: theme.linecolor
      },
      barmode: 'overlay',
      legend: {
        orientation: 'h',
        x: 0,
        y: 1.12,
        font: { size: 11 }
      }
    };

    const config = { responsive: true, displayModeBar: false };
    Plotly.newPlot(el, traces, layout, config);
  }

  // ── State Mutators ───────────────────────────────────────────────────────────
  function setActiveModel(id) {
    if (!id || id === statsState.activeModel) return;
    statsState.activeModel = id;

    // Sync dropdowns
    const selA = document.getElementById('stats-select-sysA');
    if (selA) selA.value = id;
    statsState.selectedPair.systemA = id;

    const cM1 = document.getElementById('stats-corpus-m1');
    if (cM1) cM1.value = id;

    const bM1 = document.getElementById('stats-boot-m1');
    if (bM1) bM1.value = id;

    renderForestLeaderboard();
    renderPairwiseExplorer();
    renderCorpusProfile();
    renderBootstrapUncertainty();
  }

  function selectPair(sysA, sysB) {
    statsState.selectedPair = { systemA: sysA, systemB: sysB };
    statsState.activeModel = sysA;
    statsState.comparisonModel = sysB;

    // Sync select elements
    const sA = document.getElementById('stats-select-sysA');
    const sB = document.getElementById('stats-select-sysB');
    if (sA) sA.value = sysA;
    if (sB) sB.value = sysB;

    const cM1 = document.getElementById('stats-corpus-m1');
    const cM2 = document.getElementById('stats-corpus-m2');
    if (cM1) cM1.value = sysA;
    if (cM2) cM2.value = sysB;

    const bM1 = document.getElementById('stats-boot-m1');
    const bM2 = document.getElementById('stats-boot-m2');
    if (bM1) bM1.value = sysA;
    if (bM2) bM2.value = sysB;

    renderPairwiseExplorer();
    renderForestLeaderboard();
    renderCorpusProfile();
    renderBootstrapUncertainty();
  }

  // ── Setup Controls & Event Listeners ─────────────────────────────────────────
  function setupControls() {
    if (!statsState.data || !statsState.data.models) return;

    const models = statsState.data.models;

    // 1. Populate Dropdowns
    const populateSelect = (elId, selectedVal) => {
      const sel = document.getElementById(elId);
      if (!sel) return;
      sel.innerHTML = '';
      models.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = `${m.label}${m.system_type === 'algorithmic_baseline' ? ' (Baseline)' : ''}`;
        if (m.id === selectedVal) opt.selected = true;
        sel.appendChild(opt);
      });
    };

    populateSelect('stats-select-sysA', statsState.selectedPair.systemA);
    populateSelect('stats-select-sysB', statsState.selectedPair.systemB);
    populateSelect('stats-corpus-m1', statsState.activeModel);
    populateSelect('stats-corpus-m2', statsState.comparisonModel);
    populateSelect('stats-corpus-m3', statsState.comparisonModel2);
    populateSelect('stats-boot-m1', statsState.activeModel);
    populateSelect('stats-boot-m2', statsState.comparisonModel);

    // Pair Explorer Dropdown Changes
    const selA = document.getElementById('stats-select-sysA');
    const selB = document.getElementById('stats-select-sysB');
    if (selA) {
      selA.onchange = () => {
        statsState.selectedPair.systemA = selA.value;
        statsState.activeModel = selA.value;
        renderPairwiseExplorer();
        renderForestLeaderboard();
        renderCorpusProfile();
        renderBootstrapUncertainty();
      };
    }
    if (selB) {
      selB.onchange = () => {
        statsState.selectedPair.systemB = selB.value;
        statsState.comparisonModel = selB.value;
        renderPairwiseExplorer();
        renderCorpusProfile();
        renderBootstrapUncertainty();
      };
    }

    // Corpus Selectors
    ['stats-corpus-m1', 'stats-corpus-m2', 'stats-corpus-m3'].forEach((id, idx) => {
      const el = document.getElementById(id);
      if (el) {
        el.onchange = () => {
          if (idx === 0) statsState.activeModel = el.value;
          else if (idx === 1) statsState.comparisonModel = el.value;
          else if (idx === 2) statsState.comparisonModel2 = el.value;
          renderCorpusProfile();
        };
      }
    });

    // Bootstrap Selectors
    const bM1 = document.getElementById('stats-boot-m1');
    const bM2 = document.getElementById('stats-boot-m2');
    if (bM1) {
      bM1.onchange = () => {
        statsState.activeModel = bM1.value;
        renderBootstrapUncertainty();
      };
    }
    if (bM2) {
      bM2.onchange = () => {
        statsState.comparisonModel = bM2.value;
        renderBootstrapUncertainty();
      };
    }

    // Display Mode Toggle: Observed + 95% CI vs Mean ± SD
    const btnModeCi = document.getElementById('stats-forest-mode-ci');
    const btnModeSd = document.getElementById('stats-forest-mode-sd');
    if (btnModeCi && btnModeSd) {
      btnModeCi.onclick = () => {
        statsState.forestMode = 'ci';
        btnModeCi.className = 'px-3 py-1 rounded-lg font-semibold transition bg-indigo-600 text-white shadow-sm';
        btnModeSd.className = 'px-3 py-1 rounded-lg font-semibold transition text-slate-400 hover:text-slate-200';
        renderForestLeaderboard();
      };
      btnModeSd.onclick = () => {
        statsState.forestMode = 'sd';
        btnModeSd.className = 'px-3 py-1 rounded-lg font-semibold transition bg-indigo-600 text-white shadow-sm';
        btnModeCi.className = 'px-3 py-1 rounded-lg font-semibold transition text-slate-400 hover:text-slate-200';
        renderForestLeaderboard();
      };
    }

    // Collapsible Validation Table Toggle
    const btnToggleVal = document.getElementById('stats-toggle-val-table');
    const containerVal = document.getElementById('stats-val-table-container');
    const arrowVal = document.getElementById('stats-val-table-arrow');
    if (btnToggleVal && containerVal) {
      btnToggleVal.onclick = () => {
        const isHidden = containerVal.classList.contains('hidden');
        if (isHidden) {
          containerVal.classList.remove('hidden');
          if (arrowVal) arrowVal.textContent = '▲';
          btnToggleVal.querySelector('span').textContent = '📊 Hide Model Bootstrap Summary Table';
          renderValidationTable();
        } else {
          containerVal.classList.add('hidden');
          if (arrowVal) arrowVal.textContent = '▼';
          btnToggleVal.querySelector('span').textContent = '📊 Show Model Bootstrap Summary Table (μ ± σ, Bias, 95% CI)';
        }
      };
    }

    // Filter Buttons (All vs Neural)
    const btnAll = document.getElementById('stats-filter-all');
    const btnNeural = document.getElementById('stats-filter-neural');
    if (btnAll && btnNeural) {
      btnAll.onclick = () => {
        statsState.filterMode = 'all';
        btnAll.className = 'px-3 py-1 rounded-lg font-semibold transition bg-indigo-600 text-white shadow-sm';
        btnNeural.className = 'px-3 py-1 rounded-lg font-semibold transition text-slate-400 hover:text-slate-200';
        renderForestLeaderboard();
      };
      btnNeural.onclick = () => {
        statsState.filterMode = 'neural';
        btnNeural.className = 'px-3 py-1 rounded-lg font-semibold transition bg-indigo-600 text-white shadow-sm';
        btnAll.className = 'px-3 py-1 rounded-lg font-semibold transition text-slate-400 hover:text-slate-200';
        renderForestLeaderboard();
      };
    }

    // Bootstrap Distribution Type Toggle
    const distKde = document.getElementById('stats-dist-kde');
    const distHist = document.getElementById('stats-dist-hist');
    const distViolin = document.getElementById('stats-dist-violin');
    const updateDistButtons = () => {
      [
        { el: distKde, type: 'kde' },
        { el: distHist, type: 'histogram' },
        { el: distViolin, type: 'violin' }
      ].forEach(({ el, type }) => {
        if (!el) return;
        if (statsState.bootstrapPlotType === type) {
          el.className = 'px-2.5 py-1 rounded bg-indigo-600 text-white font-semibold transition shadow-sm';
        } else {
          el.className = 'px-2.5 py-1 rounded bg-slate-800 text-slate-400 hover:text-white transition';
        }
      });
    };

    if (distKde) distKde.onclick = () => { statsState.bootstrapPlotType = 'kde'; updateDistButtons(); renderBootstrapUncertainty(); };
    if (distHist) distHist.onclick = () => { statsState.bootstrapPlotType = 'histogram'; updateDistButtons(); renderBootstrapUncertainty(); };
    if (distViolin) distViolin.onclick = () => { statsState.bootstrapPlotType = 'violin'; updateDistButtons(); renderBootstrapUncertainty(); };

    // Featured Comparison Quick Chips (only statistically significant contrasts)
    const chipsContainer = document.getElementById('stats-featured-chips');
    if (chipsContainer && statsState.data.featured_comparisons) {
      chipsContainer.innerHTML = '';
      const validFeatured = statsState.data.featured_comparisons.filter(fc => fc.holm_significant_0_05);
      validFeatured.forEach(fc => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'px-3 py-1.5 rounded-lg text-xs font-medium transition border bg-slate-800/90 hover:bg-indigo-600 hover:text-white text-slate-200 border-slate-700 shadow-sm';
        btn.innerHTML = `<span>${fc.label_A} vs ${fc.label_B}</span>`;
        btn.onclick = () => {
          selectPair(fc.system_A, fc.system_B);
        };
        chipsContainer.appendChild(btn);
      });
    }

    // Matrix Mode Toggle (Upper Triangle vs Full)
    const btnTriangle = document.getElementById('stats-matrix-triangle');
    const btnFull = document.getElementById('stats-matrix-full');
    if (btnTriangle && btnFull) {
      btnTriangle.onclick = () => {
        statsState.matrixMode = 'triangle';
        btnTriangle.className = 'px-2.5 py-1 rounded-lg font-semibold transition bg-indigo-600 text-white shadow-sm';
        btnFull.className = 'px-2.5 py-1 rounded-lg font-semibold transition text-slate-400 hover:text-slate-200';
        renderPairwiseHeatmap();
      };
      btnFull.onclick = () => {
        statsState.matrixMode = 'full';
        btnFull.className = 'px-2.5 py-1 rounded-lg font-semibold transition bg-indigo-600 text-white shadow-sm';
        btnTriangle.className = 'px-2.5 py-1 rounded-lg font-semibold transition text-slate-400 hover:text-slate-200';
        renderPairwiseHeatmap();
      };
    }

    // Reset Buttons for All Plots
    const btnResetAll = document.getElementById('stats-reset-all');
    if (btnResetAll) btnResetAll.onclick = resetAllViews;

    const btnResetForest = document.getElementById('stats-reset-forest');
    if (btnResetForest) btnResetForest.onclick = resetForestView;

    const btnResetHeatmap = document.getElementById('stats-reset-heatmap');
    if (btnResetHeatmap) btnResetHeatmap.onclick = resetHeatmapView;

    const btnResetPair = document.getElementById('stats-reset-pair');
    if (btnResetPair) btnResetPair.onclick = resetPairExplorer;

    const btnResetCorpus = document.getElementById('stats-reset-corpus');
    if (btnResetCorpus) btnResetCorpus.onclick = resetCorpusProfile;

    const btnResetBoot = document.getElementById('stats-reset-boot');
    if (btnResetBoot) btnResetBoot.onclick = resetBootstrapView;
  }

  // ── Reset Handlers ───────────────────────────────────────────────────────────
  function resetAllViews() {
    statsState.filterMode = 'all';
    statsState.forestMode = 'ci';
    statsState.matrixMode = 'full';
    statsState.activeModel = 'rndvoc';
    statsState.comparisonModel = 'flow2gan';
    statsState.comparisonModel2 = 'vocos_mel_24khz';
    statsState.selectedPair = { systemA: 'rndvoc', systemB: 'flow2gan' };
    statsState.bootstrapPlotType = 'kde';

    const btnModeCi = document.getElementById('stats-forest-mode-ci');
    const btnModeSd = document.getElementById('stats-forest-mode-sd');
    if (btnModeCi && btnModeSd) {
      btnModeCi.className = 'px-3 py-1 rounded-lg font-semibold transition bg-indigo-600 text-white shadow-sm';
      btnModeSd.className = 'px-3 py-1 rounded-lg font-semibold transition text-slate-400 hover:text-slate-200';
    }

    const btnFull = document.getElementById('stats-matrix-full');
    const btnTriangle = document.getElementById('stats-matrix-triangle');
    if (btnFull && btnTriangle) {
      btnFull.className = 'px-2.5 py-1 rounded-lg font-semibold transition bg-indigo-600 text-white shadow-sm';
      btnTriangle.className = 'px-2.5 py-1 rounded-lg font-semibold transition text-slate-400 hover:text-slate-200';
    }

    setupControls();
    renderForestLeaderboard();
    renderPairwiseHeatmap();
    renderPairwiseExplorer();
    renderCorpusProfile();
    renderBootstrapUncertainty();
  }

  function resetForestView() {
    statsState.filterMode = 'all';
    statsState.forestMode = 'ci';
    statsState.activeModel = 'rndvoc';
    const btnAll = document.getElementById('stats-filter-all');
    const btnNeural = document.getElementById('stats-filter-neural');
    if (btnAll && btnNeural) {
      btnAll.className = 'px-3 py-1 rounded-lg font-semibold transition bg-indigo-600 text-white shadow-sm';
      btnNeural.className = 'px-3 py-1 rounded-lg font-semibold transition text-slate-400 hover:text-slate-200';
    }
    const btnModeCi = document.getElementById('stats-forest-mode-ci');
    const btnModeSd = document.getElementById('stats-forest-mode-sd');
    if (btnModeCi && btnModeSd) {
      btnModeCi.className = 'px-3 py-1 rounded-lg font-semibold transition bg-indigo-600 text-white shadow-sm';
      btnModeSd.className = 'px-3 py-1 rounded-lg font-semibold transition text-slate-400 hover:text-slate-200';
    }
    renderForestLeaderboard();
  }

  function resetHeatmapView() {
    statsState.matrixMode = 'full';
    const btnFull = document.getElementById('stats-matrix-full');
    const btnTriangle = document.getElementById('stats-matrix-triangle');
    if (btnFull && btnTriangle) {
      btnFull.className = 'px-2.5 py-1 rounded-lg font-semibold transition bg-indigo-600 text-white shadow-sm';
      btnTriangle.className = 'px-2.5 py-1 rounded-lg font-semibold transition text-slate-400 hover:text-slate-200';
    }
    const el = document.getElementById('stats-heatmap-chart');
    if (el) {
      Plotly.relayout(el, { 'xaxis.autorange': true, 'yaxis.autorange': true });
    }
    renderPairwiseHeatmap();
  }

  function resetPairExplorer() {
    selectPair('rndvoc', 'flow2gan');
  }

  function resetCorpusProfile() {
    statsState.activeModel = 'rndvoc';
    statsState.comparisonModel = 'flow2gan';
    statsState.comparisonModel2 = 'vocos_mel_24khz';
    const cM1 = document.getElementById('stats-corpus-m1');
    const cM2 = document.getElementById('stats-corpus-m2');
    const cM3 = document.getElementById('stats-corpus-m3');
    if (cM1) cM1.value = 'rndvoc';
    if (cM2) cM2.value = 'flow2gan';
    if (cM3) cM3.value = 'vocos_mel_24khz';
    renderCorpusProfile();
  }

  function resetBootstrapView() {
    statsState.activeModel = 'rndvoc';
    statsState.comparisonModel = 'flow2gan';
    statsState.bootstrapPlotType = 'kde';
    const bM1 = document.getElementById('stats-boot-m1');
    const bM2 = document.getElementById('stats-boot-m2');
    if (bM1) bM1.value = 'rndvoc';
    if (bM2) bM2.value = 'flow2gan';

    const distKde = document.getElementById('stats-dist-kde');
    const distHist = document.getElementById('stats-dist-hist');
    const distViolin = document.getElementById('stats-dist-violin');
    if (distKde) distKde.className = 'px-2.5 py-1 rounded bg-indigo-600 text-white font-semibold transition shadow-sm';
    if (distHist) distHist.className = 'px-2.5 py-1 rounded bg-slate-800 text-slate-400 hover:text-white transition';
    if (distViolin) distViolin.className = 'px-2.5 py-1 rounded bg-slate-800 text-slate-400 hover:text-white transition';

    renderBootstrapUncertainty();
  }

  // ── Public Interface ─────────────────────────────────────────────────────────
  async function renderStatisticsSection() {
    const loaded = await loadData();
    if (!loaded) return;

    if (!statsState.isInitialized) {
      setupControls();
      statsState.isInitialized = true;
    }

    renderProtocolSummary();
    renderForestLeaderboard();
    renderPairwiseHeatmap();
    renderPairwiseExplorer();
    renderCorpusProfile();
    renderBootstrapUncertainty();
  }

  // Expose to window for app.js and tests
  window.PRISM_STATS_MODULE = {
    state: statsState,
    loadData,
    getModel,
    getPair,
    renderStatisticsSection,
    setActiveModel,
    selectPair
  };

  window.renderStatisticsSection = renderStatisticsSection;

})();

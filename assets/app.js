/**
 * app.js — PRISM-V: A Multidimensional Evaluation of Pretrained Neural Vocoders for Speech Synthesis Platform
 * Research-Grade Static Client Engine for GitHub Pages (github.io)
 *
 * Implements:
 * - Data loading from window.PRISM_DATA (fallback fetch)
 * - Persistent Theme Engine (Dark / Light) with Plotly layout synchronization
 * - Accessibility Font-Scale Engine (5 Levels)
 * - URL Hash Routing (#overview, #leaderboard, #compare, #audio-explorer, etc.)
 * - Reactive Leaderboard with dynamic multi-corpus PESQ recomputation
 * - Multi-criteria Filtering & Custom Column Visibility
 * - Dynamic Re-ranking with weighted scoring calculator
 * - Side-by-Side Model Comparison with Multi-Dimensional Radar
 * - Enhanced Audio Explorer with Canvas Waveforms and Synchronized Playback
 * - Quality & Robustness Heatmaps / Grouped Bar Charts
 * - Efficiency Throughput Analysis with 1.0x Real-time Threshold
 * - Architecture Paradigm Analysis & Diagnostics Radar Charts
 * - Multi-Objective Pareto Frontier Scatter with Non-dominated Envelopes
 * - Model Provenance Registry Cards
 * - BibTeX 1-click Copy & CSV / JSON Data Export
 */

(function () {
  'use strict';

  // ── Global Application State ───────────────────────────────────────────────
  const state = {
    theme: localStorage.getItem('prism-theme') || 'dark',
    fontLevel: parseInt(localStorage.getItem('prism-font-level') || '3', 10),
    activeTab: 'overview',
    overviewMetric: 'overall_score',
    data: window.PRISM_DATA || null,

    // Leaderboard state
    lb: {
      search: '',
      activeDatasets: ['LJSpeech', 'LibriTTS', 'VCTK', 'Free_ST'],
      activeArchCategories: [
        'GAN-based', 'Fourier / Transformer-based', 'Flow-based',
        'Diffusion-based', 'Non-Autoregressive', 'Algorithmic DSP'
      ],
      track: 'All Tracks',
      codeFilter: 'All Code',
      ckptFilter: 'All Checkpoints',
      edgeOnly: false,
      sortCol: 'overall_score',
      sortAsc: false,
      visibleCols: {
        // Core columns
        'system_id': true,
        'rank': true,
        'model_name': true,
        // Default visible column names
        'pesq': true,
        'stoi': true,
        'utmos': true,
        'delta_wer_pct': true,
        'rtf': true,
        'speedup_x': true,
        'peak_vram_mb': true,
        'LJSpeech': true,
        'LibriTTS': true,
        'VCTK': true,
        'Free_ST': true,
        'code': true,
        'checkpoint': true,
        'is_pareto': true,
        // Hidden by default
        'mcd_db': false,
        'lsd_db': false,
        'nisqa': false,
        'params_m': false,
        'edge_feasible': false,
        'license': false,
        'architecture_family': false,
        'track': false,
        'year': false
      },
      customWeights: {
        pesq: 35,
        stoi: 20,
        utmos: 25,
        speed: 20
      },
      useCustomWeights: false
    },

    // Compare state
    compare: {
      selectedModels: ['Vocos', 'Flow2GAN (4-step)', 'RNDVoC']
    },

    // Audio Explorer state
    audio: {
      currentTag: 'clean_reading_ljspeech',
      modelA: 'Vocos',
      modelB: 'Flow2GAN (4-step)',
      syncPlayback: false,
      activePlaying: null
    },

    // Quality & Robustness state
    robustness: {
      metric: 'pesq',
      view: 'Heatmap'
    },

    // Architectures state
    arch: {
      selectedCategory: 'all',
      selectedCategories: [
        'GAN-based', 'Fourier / Transformer-based', 'Flow-based',
        'Diffusion-based', 'Non-Autoregressive', 'Algorithmic DSP'
      ]
    },

    // Diagnostics state
    diagnostics: {
      selectedModels: ['Vocos', 'Flow2GAN (4-step)', 'RNDVoC', 'BridgeVoC', 'BigVGAN-v2 (112M)'],
      metric: 'lsd_db'
    },

    // Pareto state
    pareto: {
      xCol: 'rtf',
      yCol: 'overall_score',
      logX: true,
      showPareto: true
    },

    // Model card state
    modelCard: {
      selectedModel: 'Vocos'
    }
  };

  // ── Theme Management ───────────────────────────────────────────────────────
  const FONT_SCALES = { 1: 0.82, 2: 0.91, 3: 1.0, 4: 1.12, 5: 1.25 };

  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
    const icon = document.getElementById('theme-icon');
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('prism-theme', theme);

    // Redraw all active Plotly charts with updated theme colors
    requestAnimationFrame(updateActivePlotlyCharts);
    if (state.activeTab === 'audio-explorer') {
      requestAnimationFrame(updateAudioExplorer);
    }
  }

  function toggleTheme() {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
  }

  function applyFontLevel(level) {
    level = Math.max(1, Math.min(5, parseInt(level, 10) || 3));
    state.fontLevel = level;
    const scale = FONT_SCALES[level] || 1.0;
    document.documentElement.setAttribute('data-font-level', level);
    document.documentElement.style.setProperty('--font-scale', scale);
    localStorage.setItem('prism-font-level', level);

    document.querySelectorAll('.font-dot').forEach(function (dot) {
      const dLevel = parseInt(dot.getAttribute('data-level'), 10);
      if (dLevel === level) {
        dot.classList.add('active');
        dot.setAttribute('aria-checked', 'true');
      } else {
        dot.classList.remove('active');
        dot.setAttribute('aria-checked', 'false');
      }
    });

    const decBtn = document.getElementById('font-dec-btn');
    const incBtn = document.getElementById('font-inc-btn');
    if (decBtn) decBtn.disabled = level <= 1;
    if (incBtn) incBtn.disabled = level >= 5;
  }

  function stepFont(delta) {
    applyFontLevel(state.fontLevel + delta);
  }

  window.togglePrismTheme = toggleTheme;
  window.setPrismFontLevel = applyFontLevel;
  window.stepPrismFont = stepFont;

  // ── Tab Navigation ─────────────────────────────────────────────────────────
  const TAB_IDS = [
    'overview', 'leaderboard', 'compare', 'audio-explorer',
    'robustness', 'efficiency', 'architectures', 'diagnostics',
    'pareto', 'models', 'methodology', 'submit', 'changelog'
  ];

  function switchTab(tabId, pushState = true) {
    if (!TAB_IDS.includes(tabId)) tabId = 'overview';
    state.activeTab = tabId;

    // Update Tab Buttons
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    // Update Tab Content Panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
      if (panel.id === `tab-panel-${tabId}`) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    });

    if (pushState && window.location.hash !== `#${tabId}`) {
      history.pushState(null, null, `#${tabId}`);
    }

    // Trigger chart renders for newly opened tab
    setTimeout(() => {
      renderTabCharts(tabId);
    }, 50);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  window.switchTab = switchTab;

  // ── Data Initialization ────────────────────────────────────────────────────
  async function initData() {
    if (!state.data) {
      try {
        const res = await fetch('data/prism_full_data.json');
        if (res.ok) {
          state.data = await res.json();
        }
      } catch (err) {
        console.warn('Could not fetch data/prism_full_data.json:', err);
      }
    }

    if (!state.data) {
      console.error('CRITICAL: PRISM-V dataset could not be loaded!');
      return;
    }

    // Populate UI components
    renderOverview();
    renderLeaderboard();
    renderCompare();
    renderAudioExplorer();
    renderRobustness();
    renderEfficiency();
    renderArchitectures();
    renderDiagnostics();
    renderPareto();
    renderChangelog();
  }

  // ── Plotly Helpers ─────────────────────────────────────────────────────────
  function getPlotlyTheme() {
    const isDark = state.theme === 'dark';
    return {
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      font: {
        family: 'Inter, -apple-system, sans-serif',
        color: isDark ? '#F8FAFC' : '#0F172A',
        size: 11
      },
      xaxis: {
        gridcolor: isDark ? '#1E293B' : '#E2E8F0',
        linecolor: isDark ? '#334155' : '#CBD5E1',
        tickcolor: isDark ? '#334155' : '#CBD5E1',
        zerolinecolor: isDark ? '#334155' : '#CBD5E1'
      },
      yaxis: {
        gridcolor: isDark ? '#1E293B' : '#E2E8F0',
        linecolor: isDark ? '#334155' : '#CBD5E1',
        tickcolor: isDark ? '#334155' : '#CBD5E1',
        zerolinecolor: isDark ? '#334155' : '#CBD5E1'
      }
    };
  }

  function updateActivePlotlyCharts() {
    const pTheme = getPlotlyTheme();
    const chartIds = [
      'overview-arch-bar', 'compare-radar', 'robustness-plot',
      'efficiency-bar-chart', 'arch-pesq-bar', 'diag-radar-chart',
      'diag-bar-chart', 'pareto-scatter-chart', 'diag-plotly-table',
      'diag-plotly-heatmap'
    ];
    chartIds.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.data && el.layout) {
        Plotly.relayout(el, {
          'paper_bgcolor': pTheme.paper_bgcolor,
          'plot_bgcolor': pTheme.plot_bgcolor,
          'font.color': pTheme.font.color,
          'xaxis.gridcolor': pTheme.xaxis.gridcolor,
          'xaxis.linecolor': pTheme.xaxis.linecolor,
          'yaxis.gridcolor': pTheme.yaxis.gridcolor,
          'yaxis.linecolor': pTheme.yaxis.linecolor
        });
      }
    });
  }

  function renderTabCharts(tabId) {
    if (tabId === 'overview') renderOverviewCharts();
    else if (tabId === 'compare') renderCompareRadar();
    else if (tabId === 'robustness') renderRobustnessPlot();
    else if (tabId === 'efficiency') renderEfficiencyBar();
    else if (tabId === 'architectures') renderArchBar();
    else if (tabId === 'diagnostics') {
      renderDiagRadar();
      renderDiagBar();
      if (diagTableState && diagTableState.view === 'matrix') renderDiagHeatmap();
      else if (diagTableState && diagTableState.view === 'table') renderDiagPlotlyTable();
    }
    else if (tabId === 'pareto') renderParetoPlot();
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  function formatRankBadge(rank, score, isFeasible = true, isBaseline = false) {
    if (isBaseline) {
      return `
        <div class="rank-score-pill rank-baseline" style="background-color: rgba(100, 116, 139, 0.35); border: 1px solid rgba(148, 163, 184, 0.4); color: #e2e8f0;" title="Algorithmic DSP Reference Baseline (Not ranked among neural vocoders)">
          <span class="font-bold text-[11px] uppercase tracking-wider text-slate-200">Baseline</span>
          <span class="text-xs opacity-50">·</span>
          <span class="rank-score font-bold">${score.toFixed(1)}</span>
        </div>
      `;
    }

    let medal = '';
    let cls = 'rank-regular';
    if (rank === 1) { medal = '🥇'; cls = 'rank-gold'; }
    else if (rank === 2) { medal = '🥈'; cls = 'rank-silver'; }
    else if (rank === 3) { medal = '🥉'; cls = 'rank-bronze'; }

    const isGated = !isFeasible || score <= 1.0;
    const scoreText = isGated ? `${score.toFixed(1)}†` : score.toFixed(1);
    const titleAttr = isGated ? ' title="Hardware feasibility constraint violated (RTF > 1.0 on GTX 1650 FP32 profile); composite score floored to 1.00"' : '';

    return `
      <div class="rank-score-pill ${cls}"${titleAttr}>
        ${medal ? `<span class="rank-medal">${medal}</span>` : ''}
        <span class="rank-num">#${rank}</span>
        <span class="text-xs opacity-50">·</span>
        <span class="rank-score">${scoreText}</span>
      </div>
    `;
  }

  function getActivePesq(model, activeDatasets) {
    if (!activeDatasets || activeDatasets.length === 0) return model.pesq;
    const vals = [];
    activeDatasets.forEach(d => {
      if (model.dataset_pesqs && model.dataset_pesqs[d] !== undefined && model.dataset_pesqs[d] !== null) {
        vals.push(model.dataset_pesqs[d]);
      }
    });
    if (vals.length === 0) return model.pesq;
    const sum = vals.reduce((a, b) => a + b, 0);
    return sum / vals.length;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TAB 1 — OVERVIEW (Multi-Metric Paradigm Analysis)
  // ═══════════════════════════════════════════════════════════════════════════
  const OVERVIEW_METRICS = {
    overall_score: {
      name: 'PRISM-V Score',
      unit: '/ 100',
      higherBetter: true,
      decimals: 1,
      insight: 'Algorithmic DSP and optimized GAN/Flow architectures achieve the highest composite scores by balancing high perceptual quality with low latency.'
    },
    pesq: {
      name: 'Wideband PESQ',
      unit: '',
      higherBetter: true,
      decimals: 3,
      insight: 'Flow-based (Flow2GAN) and Diffusion SDE architectures lead speech reconstruction quality (>4.4 PESQ), outperforming legacy GANs.'
    },
    stoi: {
      name: 'STOI Intelligibility',
      unit: '',
      higherBetter: true,
      decimals: 3,
      insight: 'All neural vocoders maintain strong speech intelligibility (>0.98 STOI), preserving consonant-vowel transitions with high temporal accuracy.'
    },
    utmos: {
      name: 'UTMOS Neural MOS',
      unit: '',
      higherBetter: true,
      decimals: 2,
      insight: 'Flow Matching + GAN hybrids attain highest predicted mean opinion scores (>4.1 UTMOS), minimizing metallic artifacts.'
    },
    nisqa: {
      name: 'NISQA Naturalness',
      unit: '',
      higherBetter: true,
      decimals: 2,
      insight: 'Neural MOS naturalness favors modern multi-scale architectures with high-order phase reconstruction.'
    },
    delta_wer_pct: {
      name: 'ASR Degradation (ΔWER)',
      unit: '%',
      higherBetter: false,
      decimals: 2,
      insight: 'Diffusion and GAN models achieve sub-0.05% ΔWER degradation on Whisper ASR, preserving phonetic boundaries accurately.'
    },
    lsd_db: {
      name: 'Log-Spectral Distance (LSD)',
      unit: 'dB',
      higherBetter: false,
      decimals: 2,
      insight: 'Algorithmic Griffin-Lim minimizes mathematical STFT error (3.15 dB), whereas diffusion models lead neural vocoders at ~6.5–6.6 dB.'
    },
    mcd_db: {
      name: 'Mel-Cepstral Distortion (MCD)',
      unit: 'dB',
      higherBetter: false,
      decimals: 2,
      insight: 'Flow-based and GAN architectures minimize timbral distortion (3.80–3.95 dB MCD), retaining speaker identity.'
    },
    speedup_x: {
      name: 'Throughput Speedup',
      unit: '×',
      higherBetter: true,
      decimals: 0,
      insight: 'Fourier / ConvNeXt (Vocos at 482×) and Algorithmic DSP (176×) provide extreme throughput, while diffusion requires multiple sampling steps.'
    },
    rtf: {
      name: 'Real-Time Factor (RTF)',
      unit: '',
      higherBetter: false,
      decimals: 4,
      insight: 'Fourier / ConvNeXt achieves sub-millisecond RTF (0.0021), delivering 100× faster generation than full 16-step diffusion.'
    },
    peak_vram_mb: {
      name: 'Peak GPU VRAM',
      unit: 'MB',
      higherBetter: false,
      decimals: 0,
      insight: 'Algorithmic DSP (72 MB) and Fourier ConvNeXt (112 MB) provide the lightest memory footprints, well below 1 GB edge limits.'
    },
    params_m: {
      name: 'Model Parameters',
      unit: 'M',
      higherBetter: false,
      decimals: 1,
      insight: 'RNDVoC (3.9M) and BridgeVoC (7.9M) achieve exceptional parameter efficiency, contrasting with 115M large checkpoints.'
    }
  };

  function initOverviewControls() {
    const select = document.getElementById('overview-metric-select');
    const chipContainer = document.getElementById('overview-metric-chips');
    if (!select || select.dataset.initialized) return;

    select.value = state.overviewMetric || 'overall_score';

    select.addEventListener('change', (e) => {
      state.overviewMetric = e.target.value;
      syncOverviewChips(e.target.value);
      renderOverviewCharts();
    });

    if (chipContainer) {
      chipContainer.querySelectorAll('.overview-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          const metric = btn.dataset.metric;
          state.overviewMetric = metric;
          select.value = metric;
          syncOverviewChips(metric);
          renderOverviewCharts();
        });
      });
    }

    select.dataset.initialized = 'true';
  }

  function syncOverviewChips(metric) {
    const chips = document.querySelectorAll('.overview-chip');
    chips.forEach(c => {
      if (c.dataset.metric === metric) {
        c.className = 'overview-chip active px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-semibold transition cursor-pointer';
      } else {
        c.className = 'overview-chip px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition cursor-pointer';
      }
    });
  }

  function renderOverview() {
    initOverviewControls();
    renderOverviewCharts();
  }

  function renderOverviewCharts() {
    const el = document.getElementById('overview-arch-bar');
    const analysisEl = document.getElementById('overview-metric-analysis');
    if (!el || !state.data) return;

    const metric = state.overviewMetric || 'overall_score';
    const meta = OVERVIEW_METRICS[metric] || OVERVIEW_METRICS['overall_score'];

    // Group models by arch_category
    const catMap = {};
    const catModelsMap = {};
    state.data.leaderboard.forEach(m => {
      const cat = m.arch_category;
      if (!catMap[cat]) {
        catMap[cat] = [];
        catModelsMap[cat] = [];
      }
      const val = typeof m[metric] === 'number' ? m[metric] : (parseFloat(m[metric]) || 0);
      catMap[cat].push(val);
      catModelsMap[cat].push(m);
    });

    const cats = Object.keys(catMap);
    const catMeans = cats.map(c => {
      const arr = catMap[c];
      const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
      return {
        category: c,
        mean: mean,
        formatted: mean.toFixed(meta.decimals)
      };
    });

    // Sort according to higherBetter
    catMeans.sort((a, b) => meta.higherBetter ? b.mean - a.mean : a.mean - b.mean);

    const xCats = catMeans.map(c => c.category);
    const yVals = catMeans.map(c => parseFloat(c.formatted));
    const textLabels = catMeans.map(c => `${c.formatted} ${meta.unit}`.trim());
    const colors = xCats.map(c => state.data.arch_cat_colors[c] || '#4F46E5');

    const trace = {
      x: xCats,
      y: yVals,
      type: 'bar',
      marker: { color: colors, borderRadius: 6 },
      text: textLabels,
      textposition: 'outside',
      cliponaxis: false
    };

    const pTheme = getPlotlyTheme();
    const layout = {
      ...pTheme,
      title: {
        text: `<b>Mean ${meta.name} by Architectural Paradigm (${meta.higherBetter ? 'Higher is Better ↑' : 'Lower is Better ↓'})</b>`,
        font: { size: 14 }
      },
      yaxis: {
        title: `${meta.name} ${meta.unit ? `(${meta.unit})` : ''} ${meta.higherBetter ? '↑' : '↓'}`,
        ...pTheme.yaxis
      },
      margin: { l: 60, r: 20, t: 50, b: 70 },
      height: 340,
      showlegend: false
    };

    Plotly.newPlot(el, [trace], layout, { responsive: true, displayModeBar: false });

    // Render Analysis cards
    if (analysisEl) {
      const topCat = catMeans[0];
      const topCategoryModels = catModelsMap[topCat.category] || [];
      const bestModel = [...topCategoryModels].sort((a, b) => {
        const vA = typeof a[metric] === 'number' ? a[metric] : (parseFloat(a[metric]) || 0);
        const vB = typeof b[metric] === 'number' ? b[metric] : (parseFloat(b[metric]) || 0);
        return meta.higherBetter ? vB - vA : vA - vB;
      })[0];

      const bestModelVal = bestModel ? (typeof bestModel[metric] === 'number' ? bestModel[metric].toFixed(meta.decimals) : bestModel[metric]) : '—';

      analysisEl.innerHTML = `
        <div class="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div class="text-[11px] font-bold uppercase tracking-wider text-indigo-400 mb-1">🏆 Top Performing Paradigm</div>
          <div class="text-base sm:text-lg font-bold text-slate-100 flex items-baseline gap-2">
            <span>${topCat.category}</span>
            <span class="text-sm font-mono text-indigo-400 font-bold">${topCat.formatted} ${meta.unit}</span>
          </div>
          <p class="text-xs text-slate-400 mt-1.5">
            Top model: <strong class="text-slate-200">${bestModel ? `[${bestModel.system_id || '—'}] ${bestModel.model_name}` : '—'}</strong> (${bestModelVal} ${meta.unit})
          </p>
        </div>

        <div class="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div class="text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-1">📊 Paradigm Rankings (${meta.higherBetter ? 'Best to Worst ↑' : 'Best to Worst ↓'})</div>
          <div class="space-y-1 mt-1 text-xs font-mono">
            ${catMeans.map((cat, idx) => `
              <div class="flex items-center justify-between py-0.5 border-b border-slate-900 last:border-0">
                <span class="flex items-center gap-1.5">
                  <span class="text-slate-500 font-bold w-4">#${idx + 1}</span>
                  <span class="font-sans font-semibold text-slate-300 text-[11px]">${cat.category}</span>
                </span>
                <span class="font-bold ${idx === 0 ? 'text-cyan-400' : 'text-slate-400'}">${cat.formatted} ${meta.unit}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div class="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1">💡 Paradigm Tradeoff Insight</div>
          <p class="text-xs text-slate-300 leading-relaxed mt-1">
            ${meta.insight}
          </p>
          <div class="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full ${meta.higherBetter ? 'bg-emerald-500' : 'bg-rose-500'}"></span>
            <span>Criterion: <strong>${meta.higherBetter ? 'Higher score indicates better performance' : 'Lower value indicates lower distortion/latency'}</strong></span>
          </div>
        </div>
      `;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TAB 2 — LEADERBOARD
  // ═══════════════════════════════════════════════════════════════════════════
  function renderLeaderboard() {
    setupLeaderboardControls();
    updateLeaderboardTable();
  }

  function setupLeaderboardControls() {
    // Search Box
    const searchInput = document.getElementById('lb-search-input');
    if (searchInput) {
      searchInput.value = state.lb.search;
      searchInput.oninput = (e) => {
        state.lb.search = e.target.value;
        updateLeaderboardTable();
      };
    }

    // Active Corpora Checkboxes
    document.querySelectorAll('.lb-corpus-chk').forEach(chk => {
      chk.checked = state.lb.activeDatasets.includes(chk.value);
      chk.onchange = () => {
        const val = chk.value;
        if (chk.checked) {
          if (!state.lb.activeDatasets.includes(val)) state.lb.activeDatasets.push(val);
        } else {
          state.lb.activeDatasets = state.lb.activeDatasets.filter(d => d !== val);
        }
        updateLeaderboardTable();
      };
    });

    // Architecture Taxonomy Filter Pills
    document.querySelectorAll('.lb-arch-chk').forEach(chk => {
      chk.checked = state.lb.activeArchCategories.includes(chk.value);
      chk.onchange = () => {
        const val = chk.value;
        if (chk.checked) {
          if (!state.lb.activeArchCategories.includes(val)) state.lb.activeArchCategories.push(val);
        } else {
          state.lb.activeArchCategories = state.lb.activeArchCategories.filter(c => c !== val);
        }
        updateLeaderboardTable();
      };
    });

    // Track Dropdown
    const trackSelect = document.getElementById('lb-track-select');
    if (trackSelect) {
      trackSelect.value = state.lb.track;
      trackSelect.onchange = (e) => {
        state.lb.track = e.target.value;
        updateLeaderboardTable();
      };
    }

    // Code Filter Dropdown
    const codeSelect = document.getElementById('lb-code-select');
    if (codeSelect) {
      codeSelect.value = state.lb.codeFilter;
      codeSelect.onchange = (e) => {
        state.lb.codeFilter = e.target.value;
        updateLeaderboardTable();
      };
    }

    // Checkpoint Filter Dropdown
    const ckptSelect = document.getElementById('lb-ckpt-select');
    if (ckptSelect) {
      ckptSelect.value = state.lb.ckptFilter;
      ckptSelect.onchange = (e) => {
        state.lb.ckptFilter = e.target.value;
        updateLeaderboardTable();
      };
    }

    // Edge Feasible Toggle
    const edgeBtn = document.getElementById('lb-edge-btn');
    const edgeChk = document.getElementById('lb-edge-chk');
    if (edgeBtn && edgeChk) {
      edgeBtn.onclick = () => {
        state.lb.edgeOnly = !state.lb.edgeOnly;
        edgeChk.checked = state.lb.edgeOnly;
        edgeBtn.className = state.lb.edgeOnly
          ? 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white shadow-sm transition'
          : 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition';
        edgeBtn.innerHTML = state.lb.edgeOnly ? '✅ Edge Active' : '⚡ Filter Edge';
        updateLeaderboardTable();
      };
    }

    // Column Visibility Checkboxes
    document.querySelectorAll('.lb-col-vis-chk').forEach(chk => {
      const col = chk.value;
      chk.checked = state.lb.visibleCols[col] !== false;
      chk.onchange = () => {
        state.lb.visibleCols[col] = chk.checked;
        updateLeaderboardTable();
      };
    });

    const selectAllBtn = document.getElementById('lb-cols-select-all');
    if (selectAllBtn) {
      selectAllBtn.onclick = (e) => {
        e.preventDefault();
        document.querySelectorAll('.lb-col-vis-chk').forEach(chk => {
          chk.checked = true;
          state.lb.visibleCols[chk.value] = true;
        });
        updateLeaderboardTable();
      };
    }

    const deselectAllBtn = document.getElementById('lb-cols-deselect-all');
    if (deselectAllBtn) {
      deselectAllBtn.onclick = (e) => {
        e.preventDefault();
        document.querySelectorAll('.lb-col-vis-chk').forEach(chk => {
          chk.checked = false;
          state.lb.visibleCols[chk.value] = false;
        });
        updateLeaderboardTable();
      };
    }

    // Custom Weights Sliders
    ['pesq', 'stoi', 'utmos', 'speed'].forEach(dim => {
      const slider = document.getElementById(`weight-${dim}`);
      const valDisp = document.getElementById(`weight-${dim}-val`);
      if (slider && valDisp) {
        slider.value = state.lb.customWeights[dim];
        valDisp.textContent = `${slider.value}%`;
        slider.oninput = (e) => {
          valDisp.textContent = `${e.target.value}%`;
          state.lb.customWeights[dim] = parseInt(e.target.value, 10);
          if (state.lb.useCustomWeights) updateLeaderboardTable();
        };
      }
    });

    const toggleWeightsBtn = document.getElementById('toggle-custom-weights-btn');
    if (toggleWeightsBtn) {
      toggleWeightsBtn.onclick = () => {
        state.lb.useCustomWeights = !state.lb.useCustomWeights;
        toggleWeightsBtn.textContent = state.lb.useCustomWeights ? '✅ Custom Weights Active' : '⚖️ Enable Custom Weighting';
        toggleWeightsBtn.className = state.lb.useCustomWeights
          ? 'px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white shadow-sm'
          : 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200';
        updateLeaderboardTable();
      };
    }

    // Export CSV button
    const exportCsvBtn = document.getElementById('lb-export-csv-btn');
    if (exportCsvBtn) {
      exportCsvBtn.onclick = exportLeaderboardCSV;
    }
  }

  function computeCustomScore(m, w) {
    const totalW = (w.pesq + w.stoi + w.utmos + w.speed) || 1;
    const pScore = ((m.pesq - 1) / 3.5) * 100;
    const sScore = ((m.stoi - 0.5) / 0.5) * 100;
    const uScore = ((m.utmos - 1) / 4.0) * 100;
    const spScore = Math.max(0, Math.min(100, (Math.log10(m.speedup_x + 1e-3) / Math.log10(500)) * 100));

    return (
      (w.pesq / totalW) * pScore +
      (w.stoi / totalW) * sScore +
      (w.utmos / totalW) * uScore +
      (w.speed / totalW) * spScore
    );
  }

  function getFilteredLeaderboard() {
    if (!state.data) return [];
    let list = [...state.data.leaderboard];

    // Search filter
    if (state.lb.search.trim()) {
      const terms = state.lb.search.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
      list = list.filter(m => {
        const name = m.model_name.toLowerCase();
        const arch = m.architecture_family.toLowerCase();
        return terms.some(t => name.includes(t) || arch.includes(t));
      });
    }

    // Track filter
    if (state.lb.track !== 'All Tracks') {
      list = list.filter(m => m.track === state.lb.track);
    }

    // Architecture filter
    if (state.lb.activeArchCategories.length > 0) {
      list = list.filter(m => {
        const tags = m.arch_tags || [];
        return state.lb.activeArchCategories.some(c => tags.includes(c));
      });
    }

    // Code filter
    if (state.lb.codeFilter === 'Open-Source Code Only') {
      list = list.filter(m => m.code_open);
    } else if (state.lb.codeFilter === 'Closed-Source Only') {
      list = list.filter(m => !m.code_open);
    }

    // Checkpoint filter
    if (state.lb.ckptFilter === 'Open Checkpoints Only') {
      list = list.filter(m => m.ckpt_open);
    } else if (state.lb.ckptFilter === 'Proprietary Only') {
      list = list.filter(m => !m.ckpt_open);
    }

    // Edge filter
    if (state.lb.edgeOnly) {
      list = list.filter(m => m.edge_feasible === 'Yes');
    }

    // Dynamic recomputation of active PESQ
    list = list.map(m => {
      const activePesq = getActivePesq(m, state.lb.activeDatasets);
      const customScore = state.lb.useCustomWeights
        ? computeCustomScore(m, state.lb.customWeights)
        : m.overall_score;

      return {
        ...m,
        computed_pesq: activePesq,
        display_score: customScore
      };
    });

    // Sorting
    list.sort((a, b) => {
      if (state.lb.sortCol === 'system_id') {
        const order = { 'Baseline': 0, 'M1': 1, 'M2': 2, 'M3': 3, 'M4': 4, 'M5': 5, 'M6': 6, 'M7': 7, 'M8': 8, 'M9': 9, 'M10': 10, 'M11': 11, 'M12': 12, 'M13': 13, 'M14': 14 };
        const aOrder = order[a.system_id] !== undefined ? order[a.system_id] : 999;
        const bOrder = order[b.system_id] !== undefined ? order[b.system_id] : 999;
        return state.lb.sortAsc ? aOrder - bOrder : bOrder - aOrder;
      }

      let valA = a[state.lb.sortCol];
      let valB = b[state.lb.sortCol];

      if (state.lb.sortCol === 'pesq') {
        valA = a.computed_pesq;
        valB = b.computed_pesq;
      } else if (state.lb.sortCol === 'overall_score') {
        valA = a.display_score;
        valB = b.display_score;
      }

      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      if (typeof valA === 'string') {
        return state.lb.sortAsc
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return state.lb.sortAsc ? valA - valB : valB - valA;
    });

    return list;
  }

  function getLeaderboardColumnDefinitions() {
    return [
      { id: 'system_id', label: 'ID', rawLabel: 'System ID', group: 'core', sortKey: 'system_id', tip: 'System Identifier (Baseline / M1–M14)' },
      { id: 'rank', label: 'Rank & <span class="prism-rainbow-text font-bold"><span style="color:#6366f1">P</span><span style="color:#06b6d4">R</span><span style="color:#10b981">I</span><span style="color:#f59e0b">S</span><span style="color:#f43f5e">M</span>-V</span> Score', rawLabel: 'Rank', group: 'core', sortKey: 'overall_score' },
      { id: 'model_name', label: 'Model', rawLabel: 'Model Name', group: 'core', sortKey: 'model_name' },
      { id: 'pesq', label: 'PESQ ↑', rawLabel: 'PESQ', group: 'objective', sortKey: 'pesq', tip: 'Perceptual Evaluation of Speech Quality (ITU-T P.862)' },
      { id: 'stoi', label: 'STOI ↑', rawLabel: 'STOI', group: 'objective', sortKey: 'stoi', tip: 'Short-Time Objective Intelligibility' },
      { id: 'mcd_db', label: 'MCD (dB) ↓', rawLabel: 'MCD (dB)', group: 'objective', sortKey: 'mcd_db', tip: 'Mel-Cepstral Distortion' },
      { id: 'lsd_db', label: 'LSD (dB) ↓', rawLabel: 'LSD (dB)', group: 'objective', sortKey: 'lsd_db', tip: 'Log-Spectral Distance' },
      { id: 'utmos', label: 'UTMOS ↑', rawLabel: 'UTMOS', group: 'subjective', sortKey: 'utmos', tip: 'Universal Text-to-speech MOS Predictor' },
      { id: 'nisqa', label: 'NISQA ↑', rawLabel: 'NISQA', group: 'subjective', sortKey: 'nisqa', tip: 'Deep Naturalness & Distortion Predictor' },
      { id: 'delta_wer_pct', label: 'ΔWER % ↓', rawLabel: 'ΔWER %', group: 'subjective', sortKey: 'delta_wer_pct', tip: 'Word Error Rate Degradation via Conformer ASR' },
      { id: 'rtf', label: 'RTF ↓', rawLabel: 'RTF', group: 'performance', sortKey: 'rtf', tip: 'Real-Time Factor (Latency / Duration)' },
      { id: 'speedup_x', label: 'xRT ↑', rawLabel: 'xRT Throughput', group: 'performance', sortKey: 'speedup_x', tip: 'Throughput Speedup Factor (1/RTF)' },
      { id: 'peak_vram_mb', label: 'VRAM (MB) ↓', rawLabel: 'Peak VRAM (MB)', group: 'performance', sortKey: 'peak_vram_mb', tip: 'Peak GPU Memory Allocated during Inference' },
      { id: 'params_m', label: 'Params (M)', rawLabel: 'Params (M)', group: 'performance', sortKey: 'params_m', tip: 'Generator Parameter Count in Millions' },
      { id: 'edge_feasible', label: 'Edge ⚡', rawLabel: 'Edge Feasible', group: 'performance', sortKey: 'edge_feasible', tip: 'Edge-Hardware Feasibility Status' },
      { id: 'LJSpeech', label: 'LJSpeech', rawLabel: 'LJSpeech PESQ', group: 'robustness', sortKey: 'LJSpeech', tip: 'Single-speaker Clean Studio Reading PESQ' },
      { id: 'LibriTTS', label: 'LibriTTS', rawLabel: 'LibriTTS PESQ', group: 'robustness', sortKey: 'LibriTTS', tip: 'Multi-speaker Narrative Audio-book PESQ' },
      { id: 'VCTK', label: 'VCTK', rawLabel: 'VCTK PESQ', group: 'robustness', sortKey: 'VCTK', tip: 'Regional Accented Speech PESQ' },
      { id: 'Free_ST', label: 'Free_ST', rawLabel: 'Free_ST PESQ', group: 'robustness', sortKey: 'Free_ST', tip: 'Real-world Mobile Noisy PESQ' },
      { id: 'code', label: 'Code', rawLabel: 'Code URL', group: 'info', tip: 'Public Code Availability' },
      { id: 'checkpoint', label: 'Checkpoint', rawLabel: 'Checkpoint URL', group: 'info', tip: 'Pretrained Checkpoint Availability' },
      { id: 'paper', label: 'Paper', rawLabel: 'Paper URL', group: 'info', tip: 'Scientific Research Paper' },
      { id: 'is_pareto', label: 'Pareto ⭐', rawLabel: 'Pareto Optimal', group: 'info', sortKey: 'is_pareto', tip: 'Non-dominated Pareto Optimal Checkpoint' },
      { id: 'license', label: 'License', rawLabel: 'License', group: 'info', sortKey: 'license', tip: 'Open License' },
      { id: 'architecture_family', label: 'Architecture', rawLabel: 'Architecture Family', group: 'info', sortKey: 'architecture_family', tip: 'Architecture Family' },
      { id: 'track', label: 'Track', rawLabel: 'Track', group: 'info', sortKey: 'track', tip: 'Benchmark Track' },
      { id: 'year', label: 'Year', rawLabel: 'Year', group: 'info', sortKey: 'year', tip: 'Release Year' }
    ];
  }

  function formatCheckpointButton(url, isBase = false, compact = false) {
    if (!url || url.startsWith('N/A')) {
      return isBase ? '<span class="text-xs text-slate-400 italic">— Algorithmic</span>' : '—';
    }
    let icon = '📦';
    let label = compact ? 'Ckpt' : 'Checkpoint';
    let btnClass = 'tbl-btn-ckpt';
    if (url.includes('huggingface.co')) {
      icon = '🤗';
      label = compact ? 'HF' : 'Hugging Face';
      btnClass = 'tbl-btn-hf';
    } else if (url.includes('drive.google.com')) {
      icon = '📁';
      label = compact ? 'Drive' : 'Google Drive';
      btnClass = 'tbl-btn-gdrive';
    } else if (url.includes('github.com')) {
      icon = '💻';
      label = compact ? 'GitHub' : 'GitHub';
      btnClass = 'tbl-btn-gh';
    }
    const compactClass = compact ? 'text-[10px] inline-flex items-center gap-0.5 px-1.5 py-0.5' : '';
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="tbl-btn ${btnClass} ${compactClass}">${icon} ${label}</a>`;
  }

  function formatCodeButton(url, compact = false) {
    if (!url) return '<span class="text-xs text-slate-400">—</span>';
    const compactClass = compact ? 'text-[10px] inline-flex items-center gap-0.5 px-1.5 py-0.5' : '';
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="tbl-btn tbl-btn-code ${compactClass}">💻 Code</a>`;
  }

  function updateLeaderboardTable() {
    const tbody = document.getElementById('lb-table-body');
    const thead = document.getElementById('lb-table-head');
    const countEl = document.getElementById('lb-model-count');
    if (!tbody || !thead || !state.data) return;

    const list = getFilteredLeaderboard();
    if (countEl) countEl.textContent = `${list.length} / ${state.data.leaderboard.length} models`;

    // Define columns
    const columns = getLeaderboardColumnDefinitions();
    const activeCols = columns.filter(c => state.lb.visibleCols[c.id]);

    // Handle empty columns
    if (activeCols.length === 0) {
      thead.innerHTML = '<tr><th class="py-3 px-4 text-slate-400">No Columns Selected</th></tr>';
      tbody.innerHTML = '<tr><td class="text-center py-10 text-slate-400 text-sm">No columns currently selected. Open <b>Customize Visible Columns &amp; Metrics</b> above to select columns to display.</td></tr>';
      return;
    }

    // Render Table Header
    thead.innerHTML = `
      <tr>
        ${activeCols.map(c => {
          let sortClass = '';
          if (c.sortKey && state.lb.sortCol === c.sortKey) {
            sortClass = state.lb.sortAsc ? 'sorted-asc' : 'sorted-desc';
          }
          const tipAttr = c.tip ? `class="has-tooltip ${sortClass}" data-tooltip="${c.tip}"` : `class="${sortClass}"`;
          const clickHandler = c.sortKey ? `onclick="window.handleLbSort('${c.sortKey}')"` : '';
          return `<th ${tipAttr} ${clickHandler}>${c.label}</th>`;
        }).join('')}
      </tr>
    `;

    // Render Table Body
    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="${activeCols.length}" class="text-center py-10 text-slate-400">
            No models match the current filter criteria.
          </td>
        </tr>
      `;
      return;
    }

    let neuralRank = 0;
    tbody.innerHTML = list.map((m) => {
      const isBaseline = m.is_baseline || m.system_id === 'Baseline' || m.model_id === 'griffin_lim';
      let rankNum = 0;
      if (!isBaseline) {
        neuralRank++;
        rankNum = neuralRank;
      }
      const rankBadge = formatRankBadge(rankNum, m.display_score, m.edge_feasible === 'Yes', isBaseline);
      const rowStyle = isBaseline ? 'style="background-color: rgba(148, 163, 184, 0.25); border-left: 3px solid #94a3b8;"' : '';

      return `
        <tr ${rowStyle}>
          ${activeCols.map(c => {
            switch (c.id) {
              case 'system_id':
                return `
                  <td class="text-center font-mono font-bold">
                    <span class="inline-block px-2 py-0.5 rounded text-xs border ${isBaseline ? 'bg-slate-700/80 text-slate-200 border-slate-600' : 'bg-indigo-950/80 text-indigo-300 border-indigo-700/60'}">
                      ${m.system_id || '—'}
                    </span>
                  </td>
                `;
              case 'rank':
                return `<td>${rankBadge}</td>`;
              case 'model_name':
                return `
                  <td class="font-semibold">
                    <button onclick="window.viewSpecificModel('${m.model_name}')" class="text-indigo-600 dark:text-indigo-400 hover:underline text-left">
                      ${m.model_name}
                    </button>
                    <div class="text-[11px] text-slate-400 font-normal">${m.architecture_family}</div>
                  </td>
                `;
              case 'pesq':
                return `<td class="num-cell font-mono font-bold text-indigo-600 dark:text-indigo-400">${m.computed_pesq.toFixed(3)}</td>`;
              case 'stoi':
                return `<td class="num-cell font-mono">${m.stoi.toFixed(3)}</td>`;
              case 'mcd_db':
                return `<td class="num-cell font-mono">${m.mcd_db.toFixed(2)}</td>`;
              case 'lsd_db':
                return `<td class="num-cell font-mono">${m.lsd_db.toFixed(2)}</td>`;
              case 'utmos':
                return `<td class="num-cell font-mono text-purple-600 dark:text-purple-400 font-semibold">${m.utmos.toFixed(2)}</td>`;
              case 'nisqa':
                return `<td class="num-cell font-mono">${m.nisqa.toFixed(2)}</td>`;
              case 'delta_wer_pct':
                return `<td class="num-cell font-mono">${m.delta_wer_pct.toFixed(2)}%</td>`;
              case 'rtf':
                return `<td class="num-cell font-mono text-amber-600 dark:text-amber-400 font-semibold">${m.rtf.toFixed(4)}</td>`;
              case 'speedup_x':
                return `<td class="num-cell font-mono font-bold text-amber-600 dark:text-amber-400">${m.speedup_x.toFixed(0)}×</td>`;
              case 'peak_vram_mb':
                return `<td class="num-cell font-mono">${m.peak_vram_mb.toFixed(0)}</td>`;
              case 'params_m':
                return `<td class="num-cell font-mono">${m.params_m.toFixed(1)}</td>`;
              case 'edge_feasible':
                return `<td>${m.edge_feasible === 'Yes' ? '✅' : '❌'}</td>`;
              case 'LJSpeech':
                return `<td class="num-cell font-mono">${m.dataset_pesqs && m.dataset_pesqs.LJSpeech ? m.dataset_pesqs.LJSpeech.toFixed(3) : '—'}</td>`;
              case 'LibriTTS':
                return `<td class="num-cell font-mono">${m.dataset_pesqs && m.dataset_pesqs.LibriTTS ? m.dataset_pesqs.LibriTTS.toFixed(3) : '—'}</td>`;
              case 'VCTK':
                return `<td class="num-cell font-mono">${m.dataset_pesqs && m.dataset_pesqs.VCTK ? m.dataset_pesqs.VCTK.toFixed(3) : '—'}</td>`;
              case 'Free_ST':
                return `<td class="num-cell font-mono">${m.dataset_pesqs && m.dataset_pesqs.Free_ST ? m.dataset_pesqs.Free_ST.toFixed(3) : '—'}</td>`;
              case 'code':
                return `<td>${formatCodeButton(m.github_url)}</td>`;
              case 'checkpoint':
                return `<td>${formatCheckpointButton(m.checkpoint_url, isBaseline)}</td>`;
              case 'paper':
                return `
                  <td>
                    ${m.paper_url
                      ? `<a href="${m.paper_url}" target="_blank" rel="noopener noreferrer" class="tbl-btn tbl-btn-paper text-[11px] inline-flex items-center gap-1">📄 Paper</a>`
                      : '<span class="text-xs text-slate-400">—</span>'}
                  </td>
                `;
              case 'is_pareto':
                return `<td class="text-center">${m.is_pareto ? '⭐' : '—'}</td>`;
              case 'license':
                return `<td><span class="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700">${m.license}</span></td>`;
              case 'architecture_family':
                return `<td class="text-xs">${m.architecture_family}</td>`;
              case 'track':
                return `<td class="text-xs text-slate-500 dark:text-slate-400">${m.track}</td>`;
              case 'year':
                return `<td class="num-cell font-mono text-xs">${m.year}</td>`;
              default:
                return `<td>${m[c.id] !== undefined ? m[c.id] : '—'}</td>`;
            }
          }).join('')}
        </tr>
      `;
    }).join('');
  }

  window.handleLbSort = function (sortKey) {
    if (state.lb.sortCol === sortKey) {
      state.lb.sortAsc = !state.lb.sortAsc;
    } else {
      state.lb.sortCol = sortKey;
      state.lb.sortAsc = ['rtf', 'mcd_db', 'lsd_db', 'delta_wer_pct', 'peak_vram_mb', 'params_m'].includes(sortKey);
    }
    updateLeaderboardTable();
  };

  window.viewSpecificModel = function (modelName) {
    if (state.audio) {
      state.audio.modelA = modelName;
      renderAudioExplorer();
    }
    switchTab('audio-explorer');
  };

  function exportLeaderboardCSV() {
    const list = getFilteredLeaderboard();
    if (!list || list.length === 0) {
      alert('No models match the current filter criteria to export.');
      return;
    }

    const columns = getLeaderboardColumnDefinitions();
    const activeCols = columns.filter(c => state.lb.visibleCols[c.id]);
    if (activeCols.length === 0) {
      alert('Please select at least one visible column in "Customize Visible Columns & Metrics" before exporting.');
      return;
    }

    const headers = activeCols.map(c => `"${c.rawLabel || c.label.replace(/<[^>]*>?/gm, '').trim()}"`);

    let neuralRank = 0;
    const rows = list.map((m) => {
      const isBaseline = m.is_baseline || m.system_id === 'Baseline' || m.model_id === 'griffin_lim';
      let rankStr = 'Baseline';
      if (!isBaseline) {
        neuralRank++;
        rankStr = String(neuralRank);
      }

      const rowValues = activeCols.map(c => {
        let val = '';
        switch (c.id) {
          case 'system_id':
            val = m.system_id || '';
            break;
          case 'rank':
            val = isBaseline ? 'Baseline (79.0)' : `${rankStr} (${m.display_score !== undefined ? m.display_score.toFixed(1) : (m.overall_score || 0).toFixed(1)})`;
            break;
          case 'model_name':
            val = m.model_name || '';
            break;
          case 'pesq':
            val = m.computed_pesq !== undefined ? m.computed_pesq.toFixed(3) : (m.pesq || 0).toFixed(3);
            break;
          case 'stoi':
            val = m.stoi !== undefined ? m.stoi.toFixed(3) : '';
            break;
          case 'mcd_db':
            val = m.mcd_db !== undefined ? m.mcd_db.toFixed(2) : '';
            break;
          case 'lsd_db':
            val = m.lsd_db !== undefined ? m.lsd_db.toFixed(2) : '';
            break;
          case 'utmos':
            val = m.utmos !== undefined ? m.utmos.toFixed(2) : '';
            break;
          case 'nisqa':
            val = m.nisqa !== undefined ? m.nisqa.toFixed(2) : '';
            break;
          case 'delta_wer_pct':
            val = m.delta_wer_pct !== undefined ? `${m.delta_wer_pct.toFixed(2)}%` : '';
            break;
          case 'rtf':
            val = m.rtf !== undefined ? m.rtf.toFixed(4) : '';
            break;
          case 'speedup_x':
            val = m.speedup_x !== undefined ? `${m.speedup_x.toFixed(0)}×` : '';
            break;
          case 'peak_vram_mb':
            val = m.peak_vram_mb !== undefined ? m.peak_vram_mb.toFixed(0) : '';
            break;
          case 'params_m':
            val = m.params_m !== undefined ? m.params_m.toFixed(1) : '';
            break;
          case 'edge_feasible':
            val = m.edge_feasible || '';
            break;
          case 'LJSpeech':
            val = m.dataset_pesqs && m.dataset_pesqs.LJSpeech ? m.dataset_pesqs.LJSpeech.toFixed(3) : '';
            break;
          case 'LibriTTS':
            val = m.dataset_pesqs && m.dataset_pesqs.LibriTTS ? m.dataset_pesqs.LibriTTS.toFixed(3) : '';
            break;
          case 'VCTK':
            val = m.dataset_pesqs && m.dataset_pesqs.VCTK ? m.dataset_pesqs.VCTK.toFixed(3) : '';
            break;
          case 'Free_ST':
            val = m.dataset_pesqs && m.dataset_pesqs.Free_ST ? m.dataset_pesqs.Free_ST.toFixed(3) : '';
            break;
          case 'code':
            val = m.github_url || '';
            break;
          case 'checkpoint':
            val = m.checkpoint_url || '';
            break;
          case 'paper':
            val = m.paper_url || '';
            break;
          case 'is_pareto':
            val = m.is_pareto ? 'Yes' : 'No';
            break;
          case 'license':
            val = m.license || '';
            break;
          case 'architecture_family':
            val = m.architecture_family || '';
            break;
          case 'track':
            val = m.track || '';
            break;
          case 'year':
            val = m.year || '';
            break;
          default:
            val = m[c.id] !== undefined ? String(m[c.id]) : '';
            break;
        }
        if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
          val = `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      });

      return rowValues.join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'prism_v_leaderboard_custom_view.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TAB 3 — COMPARE (Side-by-Side Model Comparison)
  // ═══════════════════════════════════════════════════════════════════════════
  function renderCompare() {
    const selectContainer = document.getElementById('compare-models-select-container');
    if (!selectContainer || !state.data) return;

    selectContainer.innerHTML = state.data.leaderboard.map(m => {
      const isChecked = state.compare.selectedModels.includes(m.model_name);
      return `
        <label class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-semibold cursor-pointer select-none hover:border-indigo-500 transition">
          <input type="checkbox" value="${m.model_name}" class="compare-model-chk text-indigo-600 rounded" ${isChecked ? 'checked' : ''} />
          <span class="font-mono text-slate-400 font-bold">[${m.system_id || '—'}]</span>
          <span>${m.model_name}</span>
        </label>
      `;
    }).join('');

    document.querySelectorAll('.compare-model-chk').forEach(chk => {
      chk.onchange = () => {
        const checked = Array.from(document.querySelectorAll('.compare-model-chk:checked')).map(c => c.value);
        if (checked.length > 4) {
          chk.checked = false;
          alert('You can select a maximum of 4 models to compare side-by-side.');
          return;
        }
        if (checked.length < 1) {
          chk.checked = true;
          alert('Please keep at least 1 model selected.');
          return;
        }
        state.compare.selectedModels = checked;
        updateCompareView();
      };
    });

    updateCompareView();
  }

  function updateCompareView() {
    renderCompareTable();
    renderCompareRadar();
  }

  function renderCompareTable() {
    const tableEl = document.getElementById('compare-matrix-table');
    if (!tableEl || !state.data) return;

    const models = state.compare.selectedModels.map(name =>
      state.data.leaderboard.find(m => m.model_name === name)
    ).filter(Boolean);

    const rows = [
      { 
        label: 'System ID', 
        get: m => {
          const isBase = m.is_baseline || m.system_id === 'Baseline';
          return `<span class="px-2 py-0.5 rounded text-xs font-mono font-bold ${isBase ? 'bg-slate-700 text-slate-200 border border-slate-600' : 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/50'}">${m.system_id || '—'}</span>`;
        } 
      },
      { label: '🏆 <span class="prism-rainbow-text font-bold"><span style="color:#6366f1">P</span><span style="color:#06b6d4">R</span><span style="color:#10b981">I</span><span style="color:#f59e0b">S</span><span style="color:#f43f5e">M</span>-V</span> Score (1–100) ↑', get: m => m.overall_score.toFixed(1) },
      { label: 'Wideband PESQ ↑', get: m => m.pesq.toFixed(3) },
      { label: 'STOI Intelligibility ↑', get: m => m.stoi.toFixed(3) },
      { label: 'UTMOS Neural MOS ↑', get: m => m.utmos.toFixed(2) },
      { label: 'NISQA Naturalness ↑', get: m => m.nisqa.toFixed(2) },
      { label: 'ASR Degradation (ΔWER) ↓', get: m => `${m.delta_wer_pct.toFixed(2)}%` },
      { label: 'Mel-Cepstral Dist. (MCD) ↓', get: m => `${m.mcd_db.toFixed(2)} dB` },
      { label: 'Log-Spectral Dist. (LSD) ↓', get: m => `${m.lsd_db.toFixed(2)} dB` },
      { label: 'Real-Time Factor (RTF) ↓', get: m => m.rtf.toFixed(4) },
      { label: 'Throughput (xRT) ↑', get: m => `${m.speedup_x.toFixed(0)}×` },
      { label: 'Peak GPU VRAM ↓', get: m => `${m.peak_vram_mb.toFixed(0)} MB` },
      { label: 'Generator Parameters', get: m => `${m.params_m.toFixed(1)} M` },
      { label: 'Architecture Family', get: m => m.architecture_family },
      { label: 'Edge Feasible Profile', get: m => m.edge_feasible === 'Yes' ? '✅ Feasible' : '❌ Infeasible' },
      { label: 'Pareto Optimal ⭐', get: m => m.is_pareto ? '⭐ Yes' : '—' },
      { label: 'Code Repository', get: m => m.github_url ? `<a href="${m.github_url}" target="_blank" rel="noopener noreferrer" class="tbl-btn tbl-btn-gh text-[11px] inline-flex items-center gap-1">💻 GitHub</a>` : '—' },
      { label: 'Model Checkpoint', get: m => m.checkpoint_url && !m.checkpoint_url.startsWith('N/A') ? `<a href="${m.checkpoint_url}" target="_blank" rel="noopener noreferrer" class="tbl-btn tbl-btn-ckpt text-[11px] inline-flex items-center gap-1">📦 Checkpoint</a>` : (m.is_baseline ? '<span class="text-xs text-slate-400 italic">Algorithmic</span>' : '—') },
      { label: 'License', get: m => m.license }
    ];

    tableEl.innerHTML = `
      <thead>
        <tr>
          <th class="p-3 bg-slate-100 dark:bg-slate-800 text-left font-bold text-xs uppercase">Metric / Dimension</th>
          ${models.map(m => {
            const isBase = m.is_baseline || m.system_id === 'Baseline';
            const colStyle = isBase ? 'style="background-color: rgba(148, 163, 184, 0.25); border-top: 3px solid #94a3b8;"' : '';
            return `
              <th class="p-3 text-left font-bold text-xs uppercase text-indigo-600 dark:text-indigo-400" ${colStyle}>
                <div class="font-mono text-xs text-slate-400 font-normal mb-0.5">[${m.system_id || '—'}]</div>
                <div>${m.model_name}</div>
              </th>
            `;
          }).join('')}
        </tr>
      </thead>
      <tbody>
        ${rows.map(r => `
          <tr class="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <td class="p-3 font-semibold text-xs text-slate-700 dark:text-slate-300">${r.label}</td>
            ${models.map(m => {
              const isBase = m.is_baseline || m.system_id === 'Baseline';
              const cellStyle = isBase ? 'style="background-color: rgba(148, 163, 184, 0.25);"' : '';
              return `<td class="p-3 font-mono text-xs font-bold" ${cellStyle}>${r.get(m)}</td>`;
            }).join('')}
          </tr>
        `).join('')}
      </tbody>
    `;
  }

  const compareRadarState = {
    rotation: 0,
    maxR: 100
  };

  function initCompareRadarControls() {
    const rotLeft = document.getElementById('compare-radar-rot-left');
    const rotRight = document.getElementById('compare-radar-rot-right');
    const zoomIn = document.getElementById('compare-radar-zoom-in');
    const zoomOut = document.getElementById('compare-radar-zoom-out');
    const resetBtn = document.getElementById('compare-radar-reset');
    const badge = document.getElementById('compare-radar-badge');
    const el = document.getElementById('compare-radar');

    if (!rotLeft || rotLeft.dataset.initialized) return;

    rotLeft.addEventListener('click', () => {
      compareRadarState.rotation = (compareRadarState.rotation + 45) % 360;
      if (badge) badge.textContent = `${compareRadarState.rotation}°`;
      if (el && el.data) Plotly.relayout(el, { 'polar.angularaxis.rotation': compareRadarState.rotation });
    });

    rotRight.addEventListener('click', () => {
      compareRadarState.rotation = (compareRadarState.rotation - 45 + 360) % 360;
      if (badge) badge.textContent = `${compareRadarState.rotation}°`;
      if (el && el.data) Plotly.relayout(el, { 'polar.angularaxis.rotation': compareRadarState.rotation });
    });

    zoomIn.addEventListener('click', () => {
      compareRadarState.maxR = Math.max(30, Math.round(compareRadarState.maxR * 0.8));
      if (el && el.data) Plotly.relayout(el, { 'polar.radialaxis.range': [0, compareRadarState.maxR] });
    });

    zoomOut.addEventListener('click', () => {
      compareRadarState.maxR = Math.min(250, Math.round(compareRadarState.maxR * 1.25));
      if (el && el.data) Plotly.relayout(el, { 'polar.radialaxis.range': [0, compareRadarState.maxR] });
    });

    resetBtn.addEventListener('click', () => {
      compareRadarState.rotation = 0;
      compareRadarState.maxR = 100;
      if (badge) badge.textContent = '0°';
      renderCompareRadar();
    });

    rotLeft.dataset.initialized = 'true';
  }

  function renderCompareRadar() {
    const el = document.getElementById('compare-radar');
    const badge = document.getElementById('compare-radar-badge');
    if (!el || !state.data) return;

    initCompareRadarControls();
    if (badge) badge.textContent = `${compareRadarState.rotation}°`;

    const models = state.compare.selectedModels.map(name =>
      state.data.leaderboard.find(m => m.model_name === name)
    ).filter(Boolean);

    const categories = ['PRISM-V Score', 'PESQ', 'STOI', 'UTMOS', 'ΔWER inv.', 'xRT norm.'];
    const maxVals = { score: 100, pesq: 4.5, stoi: 1.0, utmos: 5.0, wer: 15, xrt: 400 };

    const traces = models.map(m => {
      const vals = [
        (m.overall_score / maxVals.score) * 100,
        (m.pesq / maxVals.pesq) * 100,
        (m.stoi / maxVals.stoi) * 100,
        (m.utmos / maxVals.utmos) * 100,
        Math.max(0, (1 - m.delta_wer_pct / maxVals.wer) * 100),
        Math.min(100, (m.speedup_x / maxVals.xrt) * 100)
      ];
      vals.push(vals[0]); // close polygon

      const color = state.data.family_colors[m.architecture_family] || '#4F46E5';

      return {
        type: 'scatterpolar',
        r: vals,
        theta: [...categories, categories[0]],
        name: `[${m.system_id || '—'}] ${m.model_name}`,
        line: { color: color, width: 2.5 },
        fill: 'toself',
        fillcolor: color + '22'
      };
    });

    const pTheme = getPlotlyTheme();
    const layout = {
      ...pTheme,
      polar: {
        radialaxis: { visible: true, range: [0, compareRadarState.maxR], gridcolor: pTheme.xaxis.gridcolor },
        angularaxis: { rotation: compareRadarState.rotation, gridcolor: pTheme.xaxis.gridcolor }
      },
      title: { text: '<b>Normalized Multi-Dimensional Radar Comparison (0–100)</b>', font: { size: 14 } },
      margin: { l: 60, r: 60, t: 50, b: 60 },
      height: 480,
      legend: { orientation: 'h', y: -0.15, x: 0.5, xanchor: 'center' }
    };

    Plotly.newPlot(el, traces, layout, { responsive: true, displayModeBar: false });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TAB 4 — AUDIO EXPLORER
  // ═══════════════════════════════════════════════════════════════════════════
  function renderAudioExplorer() {
    const uttSelect = document.getElementById('audio-condition-select');
    const modASelect = document.getElementById('audio-model-a-select');
    const modBSelect = document.getElementById('audio-model-b-select');
    if (!uttSelect || !modASelect || !modBSelect || !state.data) return;

    // Populate conditions
    uttSelect.innerHTML = state.data.arena_manifest.map(item => `
      <option value="${item.tag}">${item.description}</option>
    `).join('');
    uttSelect.value = state.audio.currentTag;

    // Populate models
    const modelOptions = state.data.leaderboard.map(m => `
      <option value="${m.model_name}">${m.model_name}</option>
    `).join('');
    modASelect.innerHTML = modelOptions;
    modBSelect.innerHTML = modelOptions;
    modASelect.value = state.audio.modelA;
    modBSelect.value = state.audio.modelB;

    uttSelect.onchange = (e) => {
      state.audio.currentTag = e.target.value;
      updateAudioExplorer();
    };

    modASelect.onchange = (e) => {
      state.audio.modelA = e.target.value;
      updateAudioExplorer();
    };

    modBSelect.onchange = (e) => {
      state.audio.modelB = e.target.value;
      updateAudioExplorer();
    };

    // Synchronized playback button
    const syncBtn = document.getElementById('audio-sync-play-btn');
    if (syncBtn) {
      syncBtn.onclick = () => {
        state.audio.syncPlayback = !state.audio.syncPlayback;
        syncBtn.className = state.audio.syncPlayback
          ? 'px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white shadow transition'
          : 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition';
        syncBtn.innerHTML = state.audio.syncPlayback ? '🔄 Sync Play Active' : '🔄 Enable Sync Play';
      };
    }

    updateAudioExplorer();
  }

  function updateAudioExplorer() {
    if (!state.data) return;

    const currentItem = state.data.arena_manifest.find(item => item.tag === state.audio.currentTag);
    if (!currentItem) return;

    const tag = currentItem.tag;
    const wfTagData = window.PRISM_WAVEFORMS ? window.PRISM_WAVEFORMS[tag] : null;

    // Reference audio
    const refPlayer = document.getElementById('audio-ref-player');
    const refPath = currentItem.ref_audio;
    if (refPlayer) {
      refPlayer.src = refPath;
      const gtWf = wfTagData ? wfTagData['ground_truth'] : null;
      if (gtWf) {
        const metaBadge = document.getElementById('ref-metadata-badge');
        if (metaBadge) metaBadge.textContent = `Uncompressed 24kHz Reference · ${gtWf.dur.toFixed(2)}s`;
        const peakEl = document.getElementById('ref-stats-peak');
        if (peakEl) peakEl.textContent = `Peak: ${gtWf.peak.toFixed(3)}`;
        const rmsEl = document.getElementById('ref-stats-rms');
        if (rmsEl) rmsEl.textContent = `RMS: ${gtWf.rms.toFixed(1)} dBFS`;
        const timeDisp = document.getElementById('ref-playhead-time');
        if (timeDisp) timeDisp.textContent = `0.00s / ${gtWf.dur.toFixed(2)}s`;
        drawScientificWaveform('ref-waveform-canvas', gtWf, refPlayer, 'ref-playhead-time', '#10B981');
      }
    }

    // Model A
    const mA = state.data.leaderboard.find(m => m.model_name === state.audio.modelA);
    const playerA = document.getElementById('audio-a-player');
    const cardA = document.getElementById('audio-a-card');
    if (mA && currentItem.models[mA.model_id]) {
      const pathA = currentItem.models[mA.model_id];
      if (playerA) {
        playerA.src = pathA;
        const aWf = wfTagData ? wfTagData[mA.model_id] : null;
        if (aWf) {
          const timeA = document.getElementById('audio-a-playhead-time');
          if (timeA) timeA.textContent = `0.00s / ${aWf.dur.toFixed(2)}s`;
          drawScientificWaveform('audio-a-waveform-canvas', aWf, playerA, 'audio-a-playhead-time', '#6366F1');
        }
      }
      if (cardA) cardA.innerHTML = renderModelCardSnippet(mA);
    }

    // Model B
    const mB = state.data.leaderboard.find(m => m.model_name === state.audio.modelB);
    const playerB = document.getElementById('audio-b-player');
    const cardB = document.getElementById('audio-b-card');
    if (mB && currentItem.models[mB.model_id]) {
      const pathB = currentItem.models[mB.model_id];
      if (playerB) {
        playerB.src = pathB;
        const bWf = wfTagData ? wfTagData[mB.model_id] : null;
        if (bWf) {
          const timeB = document.getElementById('audio-b-playhead-time');
          if (timeB) timeB.textContent = `0.00s / ${bWf.dur.toFixed(2)}s`;
          drawScientificWaveform('audio-b-waveform-canvas', bWf, playerB, 'audio-b-playhead-time', '#06B6D4');
        }
      }
      if (cardB) cardB.innerHTML = renderModelCardSnippet(mB);
    }



    // Synchronize play events if syncPlayback is enabled
    setupSyncAudio(playerA, playerB);
  }

  function setupSyncAudio(playerA, playerB) {
    if (!playerA || !playerB) return;

    playerA.onplay = () => {
      if (state.audio.syncPlayback) {
        playerB.currentTime = playerA.currentTime;
        playerB.play().catch(() => {});
      }
    };
    playerA.onpause = () => {
      if (state.audio.syncPlayback) playerB.pause();
    };
    playerA.onseeked = () => {
      if (state.audio.syncPlayback) playerB.currentTime = playerA.currentTime;
    };

    playerB.onplay = () => {
      if (state.audio.syncPlayback) {
        playerA.currentTime = playerB.currentTime;
        playerA.play().catch(() => {});
      }
    };
    playerB.onpause = () => {
      if (state.audio.syncPlayback) playerA.pause();
    };
    playerB.onseeked = () => {
      if (state.audio.syncPlayback) playerA.currentTime = playerB.currentTime;
    };
  }

  function renderModelCardSnippet(m) {
    const color = state.data.family_colors[m.architecture_family] || '#4F46E5';
    return `
      <div class="vocoder-card">
        <div class="flex items-center justify-between mb-2">
          <span class="vocoder-card-tag" style="background:${color}22;color:${color};border:1px solid ${color}55;">
            ${m.architecture_family}
          </span>
          <span class="text-xs text-slate-400 font-semibold">${m.track} · ${m.year}</span>
        </div>
        <div class="vocoder-metrics-grid">
          <div class="vocoder-metric-box">
            <div class="vocoder-metric-lbl">Wideband PESQ</div>
            <div class="vocoder-metric-val text-indigo-500">${m.pesq.toFixed(3)}</div>
          </div>
          <div class="vocoder-metric-box">
            <div class="vocoder-metric-lbl">UTMOS MOS</div>
            <div class="vocoder-metric-val text-purple-500">${m.utmos.toFixed(2)}</div>
          </div>
          <div class="vocoder-metric-box">
            <div class="vocoder-metric-lbl">Throughput (xRT)</div>
            <div class="vocoder-metric-val text-amber-500">${m.speedup_x.toFixed(0)}×</div>
          </div>
          <div class="vocoder-metric-box">
            <div class="vocoder-metric-lbl">VRAM / Params</div>
            <div class="vocoder-metric-val text-emerald-500">${m.peak_vram_mb.toFixed(0)} MB <span class="text-xs text-slate-400 font-normal">(${m.params_m.toFixed(1)}M)</span></div>
          </div>
        </div>
        <div class="vocoder-card-actions">
          ${m.github_url ? `<a href="${m.github_url}" target="_blank" rel="noopener noreferrer" class="audio-card-btn audio-card-btn-gh">💻 GitHub</a>` : ''}
          ${m.checkpoint_url && !m.checkpoint_url.startsWith('N/A') ? `<a href="${m.checkpoint_url}" target="_blank" rel="noopener noreferrer" class="audio-card-btn audio-card-btn-ckpt">📦 Checkpoint</a>` : ''}
          ${m.paper_url ? `<a href="${m.paper_url}" target="_blank" rel="noopener noreferrer" class="audio-card-btn">📄 Paper</a>` : ''}
        </div>
      </div>
    `;
  }

  // ── Genuine Acoustic Waveform Rendering: Time (s) vs Amplitude ───────────
  function drawScientificWaveform(canvasId, waveformData, audioElement, timeDisplayId, themeColor = '#10B981') {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !waveformData) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || canvas.parentElement.clientWidth || 500;
    const height = rect.height || 140;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const padding = { top: 16, bottom: 26, left: 42, right: 18 };
    const plotWidth = Math.max(10, width - padding.left - padding.right);
    const plotHeight = Math.max(10, height - padding.top - padding.bottom);
    const duration = waveformData.dur || 1.0;
    const tArr = waveformData.t || [];
    const minArr = waveformData.min || [];
    const maxArr = waveformData.max || [];
    const nPoints = tArr.length;

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    function render(currentTime = 0) {
      ctx.clearRect(0, 0, width, height);

      // 1. Graph Background & Axes Grids
      ctx.fillStyle = isDark ? '#0B1120' : '#F8FAFC';
      ctx.fillRect(padding.left, padding.top, plotWidth, plotHeight);

      // Horizontal amplitude grid lines: +1.0, +0.5, 0.0, -0.5, -1.0
      const yLevels = [
        { amp: 1.0, label: '+1.0' },
        { amp: 0.5, label: '+0.5' },
        { amp: 0.0, label: ' 0.0' },
        { amp: -0.5, label: '-0.5' },
        { amp: -1.0, label: '-1.0' }
      ];

      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      yLevels.forEach(lvl => {
        const y = padding.top + ((1.0 - lvl.amp) / 2.0) * plotHeight;

        ctx.beginPath();
        ctx.setLineDash(lvl.amp === 0.0 ? [4, 4] : [2, 4]);
        ctx.strokeStyle = lvl.amp === 0.0
          ? (isDark ? '#475569' : '#94A3B8')
          : (isDark ? '#1E293B' : '#E2E8F0');
        ctx.lineWidth = lvl.amp === 0.0 ? 1.5 : 1;
        ctx.moveTo(padding.left, y);
        ctx.lineTo(padding.left + plotWidth, y);
        ctx.stroke();

        ctx.fillStyle = isDark ? '#94A3B8' : '#64748B';
        ctx.fillText(lvl.label, padding.left - 6, y);
      });
      ctx.setLineDash([]);

      // Vertical Y-axis line
      ctx.beginPath();
      ctx.strokeStyle = isDark ? '#334155' : '#CBD5E1';
      ctx.lineWidth = 1.5;
      ctx.moveTo(padding.left, padding.top);
      ctx.lineTo(padding.left, padding.top + plotHeight);
      ctx.stroke();

      // Horizontal X-axis line
      ctx.beginPath();
      ctx.moveTo(padding.left, padding.top + plotHeight);
      ctx.lineTo(padding.left + plotWidth, padding.top + plotHeight);
      ctx.stroke();

      // Time ticks and labels
      const step = duration > 6 ? 1.0 : (duration > 3 ? 0.5 : 0.25);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      for (let sec = 0; sec <= duration; sec += step) {
        const x = padding.left + (sec / duration) * plotWidth;
        ctx.beginPath();
        ctx.strokeStyle = isDark ? '#334155' : '#CBD5E1';
        ctx.lineWidth = 1;
        ctx.moveTo(x, padding.top + plotHeight);
        ctx.lineTo(x, padding.top + plotHeight + 4);
        ctx.stroke();

        ctx.fillStyle = isDark ? '#94A3B8' : '#64748B';
        ctx.fillText(`${sec.toFixed(1)}s`, x, padding.top + plotHeight + 6);
      }

      // Y-axis label: "Amplitude"
      ctx.save();
      ctx.translate(12, padding.top + plotHeight / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillStyle = isDark ? '#64748B' : '#94A3B8';
      ctx.font = '9px Inter, sans-serif';
      ctx.fillText('AMPLITUDE', 0, 0);
      ctx.restore();

      // 2. Draw Genuine Audio Signal Waveform Envelope
      if (nPoints > 0) {
        const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + plotHeight);
        grad.addColorStop(0, themeColor);
        grad.addColorStop(0.5, themeColor + '88');
        grad.addColorStop(1, themeColor);

        ctx.beginPath();
        for (let i = 0; i < nPoints; i++) {
          const x = padding.left + (tArr[i] / duration) * plotWidth;
          const yMax = padding.top + ((1.0 - maxArr[i]) / 2.0) * plotHeight;
          if (i === 0) ctx.moveTo(x, yMax);
          else ctx.lineTo(x, yMax);
        }
        for (let i = nPoints - 1; i >= 0; i--) {
          const x = padding.left + (tArr[i] / duration) * plotWidth;
          const yMin = padding.top + ((1.0 - minArr[i]) / 2.0) * plotHeight;
          ctx.lineTo(x, yMin);
        }
        ctx.closePath();
        ctx.fillStyle = isDark ? (themeColor + '33') : (themeColor + '22');
        ctx.fill();

        // Waveform border lines
        ctx.beginPath();
        ctx.strokeStyle = themeColor;
        ctx.lineWidth = 1.2;
        for (let i = 0; i < nPoints; i++) {
          const x = padding.left + (tArr[i] / duration) * plotWidth;
          const yMax = padding.top + ((1.0 - maxArr[i]) / 2.0) * plotHeight;
          if (i === 0) ctx.moveTo(x, yMax);
          else ctx.lineTo(x, yMax);
        }
        ctx.stroke();

        ctx.beginPath();
        for (let i = 0; i < nPoints; i++) {
          const x = padding.left + (tArr[i] / duration) * plotWidth;
          const yMin = padding.top + ((1.0 - minArr[i]) / 2.0) * plotHeight;
          if (i === 0) ctx.moveTo(x, yMin);
          else ctx.lineTo(x, yMin);
        }
        ctx.stroke();
      }

      // 3. Draw Synchronized Playhead (Time Cursor)
      const cursorX = padding.left + Math.max(0, Math.min(1, currentTime / duration)) * plotWidth;

      // Shaded played region
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(padding.left, padding.top, cursorX - padding.left, plotHeight);

      // Vertical playhead line
      ctx.beginPath();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.moveTo(cursorX, padding.top - 4);
      ctx.lineTo(cursorX, padding.top + plotHeight + 2);
      ctx.stroke();

      // Playhead pin on top
      ctx.beginPath();
      ctx.arc(cursorX, padding.top - 4, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#F59E0B';
      ctx.fill();
    }

    render(audioElement ? audioElement.currentTime : 0);

    // Synchronize with audio events
    if (audioElement) {
      audioElement.ontimeupdate = () => {
        render(audioElement.currentTime);
        if (timeDisplayId) {
          const disp = document.getElementById(timeDisplayId);
          if (disp) {
            disp.textContent = `${audioElement.currentTime.toFixed(2)}s / ${duration.toFixed(2)}s`;
          }
        }
      };

      // Click or drag to seek on the real time axis
      let isDragging = false;
      function seekFromEvent(e) {
        const cRect = canvas.getBoundingClientRect();
        const clickX = e.clientX - cRect.left;
        const ratio = Math.max(0, Math.min(1, (clickX - padding.left) / plotWidth));
        const targetTime = ratio * duration;
        audioElement.currentTime = targetTime;
        render(targetTime);
        if (timeDisplayId) {
          const disp = document.getElementById(timeDisplayId);
          if (disp) disp.textContent = `${targetTime.toFixed(2)}s / ${duration.toFixed(2)}s`;
        }
      }

      canvas.onmousedown = (e) => {
        isDragging = true;
        seekFromEvent(e);
      };
      window.addEventListener('mousemove', (e) => {
        if (isDragging) seekFromEvent(e);
      });
      window.addEventListener('mouseup', () => {
        isDragging = false;
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TAB 5 — QUALITY & ROBUSTNESS
  // ═══════════════════════════════════════════════════════════════════════════
  function renderRobustness() {
    const metricRadios = document.querySelectorAll('.rob-metric-radio');
    const viewRadios = document.querySelectorAll('.rob-view-radio');

    metricRadios.forEach(r => {
      r.checked = r.value === state.robustness.metric;
      r.onchange = () => {
        state.robustness.metric = r.value;
        renderRobustnessPlot();
      };
    });

    viewRadios.forEach(r => {
      r.checked = r.value === state.robustness.view;
      r.onchange = () => {
        state.robustness.view = r.value;
        renderRobustnessPlot();
      };
    });

    renderRobustnessPlot();
    renderRobustnessTable();
  }

  function renderRobustnessPlot() {
    const el = document.getElementById('robustness-plot');
    if (!el || !state.data) return;

    const metric = state.robustness.metric;
    const view = state.robustness.view;
    const isHeatmap = view === 'Heatmap';

    const datasets = ['LJSpeech', 'LibriTTS', 'VCTK', 'Free_ST'];
    const models = state.data.leaderboard.map(m => m.model_name);

    const pTheme = getPlotlyTheme();

    if (isHeatmap) {
      // Build 2D matrix
      const zValues = models.map(mName => {
        const m = state.data.leaderboard.find(x => x.model_name === mName);
        return datasets.map(d => {
          const mObj = m && m.dataset_metrics && m.dataset_metrics[d];
          return mObj ? mObj[metric] : null;
        });
      });

      const yLabels = state.data.leaderboard.map(m => `[${m.system_id || '—'}] ${m.model_name}`);

      const trace = {
        z: zValues,
        x: datasets,
        y: yLabels,
        type: 'heatmap',
        colorscale: ['pesq', 'stoi'].includes(metric) ? 'RdYlGn' : 'RdYlGn_r',
        hoverongaps: false,
        colorbar: { title: metric.toUpperCase(), len: 0.9 }
      };

      const layout = {
        ...pTheme,
        title: { text: `<b>Cross-Corpus Generalization Heatmap</b> — ${metric.toUpperCase()}`, font: { size: 14 } },
        margin: { l: 200, r: 60, t: 50, b: 60 },
        height: 520
      };

      Plotly.newPlot(el, [trace], layout, { responsive: true, displayModeBar: false });
    } else {
      // Grouped Bar Chart
      const xLabels = state.data.leaderboard.map(m => `[${m.system_id || '—'}] ${m.model_name}`);
      const traces = datasets.map(d => {
        const yVals = models.map(mName => {
          const m = state.data.leaderboard.find(x => x.model_name === mName);
          const mObj = m && m.dataset_metrics && m.dataset_metrics[d];
          return mObj ? mObj[metric] : 0;
        });

        return {
          name: d,
          x: xLabels,
          y: yVals,
          type: 'bar'
        };
      });

      const layout = {
        ...pTheme,
        barmode: 'group',
        title: { text: `<b>Cross-Corpus Breakdown</b> — ${metric.toUpperCase()}`, font: { size: 14 } },
        xaxis: { tickangle: -40 },
        margin: { l: 60, r: 40, t: 50, b: 120 },
        height: 500,
        legend: { orientation: 'h', y: -0.3, x: 0.5, xanchor: 'center' }
      };

      Plotly.newPlot(el, traces, layout, { responsive: true, displayModeBar: false });
    }
  }

  function renderRobustnessTable() {
    const tbody = document.getElementById('robustness-table-body');
    if (!tbody || !state.data) return;

    tbody.innerHTML = state.data.dataset_breakdown.map(r => {
      const isBase = r.system_id === 'Baseline' || r.model_name.includes('Griffin-Lim');
      const rowStyle = isBase ? 'style="background-color: rgba(148, 163, 184, 0.25);"' : '';
      return `
        <tr class="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50" ${rowStyle}>
          <td class="p-3 font-mono font-bold text-xs"><span class="px-1.5 py-0.5 rounded text-[11px] ${isBase ? 'bg-slate-700 text-slate-200 border border-slate-600' : 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/50'}">${r.system_id || '—'}</span></td>
          <td class="p-3 font-semibold text-xs">${r.model_name}</td>
          <td class="p-3 text-xs text-indigo-500 font-semibold">${r.dataset}</td>
          <td class="p-3 font-mono text-xs font-bold">${r.pesq.toFixed(3)}</td>
          <td class="p-3 font-mono text-xs">${r.stoi.toFixed(3)}</td>
          <td class="p-3 font-mono text-xs">${r.lsd_db.toFixed(2)}</td>
          <td class="p-3 font-mono text-xs">${r.mcd_db.toFixed(2)}</td>
        </tr>
      `;
    }).join('');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TAB 6 — EFFICIENCY
  // ═══════════════════════════════════════════════════════════════════════════
  function renderEfficiency() {
    renderEfficiencyBar();
    renderEfficiencyTable();
  }

  function renderEfficiencyBar() {
    const el = document.getElementById('efficiency-bar-chart');
    if (!el || !state.data) return;

    const sorted = [...state.data.leaderboard].sort((a, b) => a.speedup_x - b.speedup_x);
    const colors = sorted.map(m => state.data.family_colors[m.architecture_family] || '#4F46E5');

    const trace = {
      type: 'bar',
      orientation: 'h',
      y: sorted.map(m => `[${m.system_id || '—'}] ${m.model_name}`),
      x: sorted.map(m => m.speedup_x),
      marker: { color: colors },
      text: sorted.map(m => `${m.speedup_x.toFixed(0)}×`),
      textposition: 'outside',
      cliponaxis: false,
      hovertemplate: '<b>%{y}</b><br>Throughput: %{x:.0f}× RT<extra></extra>'
    };

    const pTheme = getPlotlyTheme();
    const layout = {
      ...pTheme,
      title: { text: '<b>Throughput (xRT = 1/RTF) — Edge Profiling</b>', font: { size: 14 } },
      xaxis: { title: 'Throughput ×RT (higher = faster)', ...pTheme.xaxis },
      margin: { l: 200, r: 80, t: 50, b: 60 },
      height: 520,
      shapes: [
        {
          type: 'line',
          x0: 1, x1: 1, y0: -0.5, y1: sorted.length - 0.5,
          line: { color: '#DC2626', width: 1.5, dash: 'dash' }
        }
      ],
      annotations: [
        {
          x: 2, y: sorted.length * 0.95,
          text: 'Real-time threshold (1.0×)',
          font: { color: '#DC2626', size: 11 },
          showarrow: false
        }
      ]
    };

    Plotly.newPlot(el, [trace], layout, { responsive: true, displayModeBar: false });
  }

  function renderEfficiencyTable() {
    const tbody = document.getElementById('efficiency-table-body');
    if (!tbody || !state.data) return;

    tbody.innerHTML = state.data.leaderboard.map(m => {
      const isBase = m.is_baseline || m.system_id === 'Baseline';
      const rowStyle = isBase ? 'style="background-color: rgba(148, 163, 184, 0.25);"' : '';
      return `
        <tr class="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50" ${rowStyle}>
          <td class="p-3 font-mono font-bold text-xs"><span class="px-1.5 py-0.5 rounded text-[11px] ${isBase ? 'bg-slate-700 text-slate-200 border border-slate-600' : 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/50'}">${m.system_id || '—'}</span></td>
          <td class="p-3 font-semibold text-xs">${m.model_name}</td>
          <td class="p-3 text-xs text-slate-400">${m.architecture_family}</td>
          <td class="p-3 font-mono text-xs font-bold text-amber-500">${m.rtf.toFixed(4)}</td>
          <td class="p-3 font-mono text-xs font-bold text-amber-500">${m.speedup_x.toFixed(0)}×</td>
          <td class="p-3 font-mono text-xs">${m.peak_vram_mb.toFixed(0)} MB</td>
          <td class="p-3 font-mono text-xs">${m.params_m.toFixed(1)} M</td>
          <td class="p-3 text-xs">${formatCodeButton(m.github_url, true)}</td>
          <td class="p-3 text-xs">${formatCheckpointButton(m.checkpoint_url, isBase, true)}</td>
          <td class="p-3 text-xs">${m.paper_url ? `<a href="${m.paper_url}" target="_blank" rel="noopener noreferrer" class="tbl-btn tbl-btn-paper text-[10px] inline-flex items-center gap-1">📄 Paper</a>` : '—'}</td>
        </tr>
      `;
    }).join('');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TAB 7 — ARCHITECTURES
  // ═══════════════════════════════════════════════════════════════════════════
  function renderArchitectures() {
    initArchControls();
    renderArchTable();
    renderArchBar();
  }

  function initArchControls() {
    const select = document.getElementById('arch-category-select');
    if (!select || !state.data) return;

    if (!select.dataset.initialized) {
      const allModels = state.data.leaderboard || [];
      const categories = ['Algorithmic DSP', 'GAN-based', 'Flow-based', 'Fourier / Transformer-based', 'Diffusion-based'];

      select.innerHTML = `
        <option value="all">All Architecture Categories (${allModels.length} Models)</option>
        ${categories.map(cat => {
          const count = allModels.filter(m => m.arch_category === cat).length;
          return `<option value="${cat}">${cat} (${count} Model${count === 1 ? '' : 's'})</option>`;
        }).join('')}
      `;
      select.value = state.arch.selectedCategory || 'all';

      select.addEventListener('change', (e) => {
        state.arch.selectedCategory = e.target.value;
        renderArchTable();
        renderArchBar();
      });

      select.dataset.initialized = 'true';
    }
  }

  function renderArchTable() {
    const tbody = document.getElementById('arch-table-body');
    const countEl = document.getElementById('arch-category-count');
    if (!tbody || !state.data) return;

    const selectedCat = state.arch.selectedCategory || 'all';
    const allModels = state.data.leaderboard || [];
    const models = allModels.filter(m => {
      if (selectedCat === 'all') return true;
      return m.arch_category === selectedCat;
    });

    if (countEl) {
      countEl.textContent = `Showing ${models.length} of ${allModels.length} models`;
    }

    if (models.length === 0) {
      tbody.innerHTML = `<tr><td colspan="15" class="p-6 text-center text-slate-400">No models found for category "${selectedCat}"</td></tr>`;
      return;
    }

    tbody.innerHTML = models.map(m => {
      const isBase = m.is_baseline || m.system_id === 'Baseline';
      const rowStyle = isBase ? 'style="background-color: rgba(148, 163, 184, 0.25);"' : '';
      return `
        <tr class="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50" ${rowStyle}>
          <td class="p-3 font-mono font-bold text-xs"><span class="px-1.5 py-0.5 rounded text-[11px] ${isBase ? 'bg-slate-700 text-slate-200 border border-slate-600' : 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/50'}">${m.system_id || '—'}</span></td>
          <td class="p-3 font-semibold text-xs">${m.model_name}</td>
          <td class="p-3 text-xs text-indigo-400 font-semibold">${m.arch_category}</td>
          <td class="p-3 text-xs text-slate-400">${m.architecture_family}</td>
          <td class="p-3 font-mono text-xs">${m.params_m.toFixed(1)} M</td>
          <td class="p-3 text-xs text-slate-400">${m.track}</td>
          <td class="p-3 font-mono text-xs">${m.year}</td>
          <td class="p-3 font-mono text-xs">${m.license}</td>
          <td class="p-3 font-mono text-xs font-bold">${m.pesq.toFixed(3)}</td>
          <td class="p-3 font-mono text-xs">${m.utmos.toFixed(2)}</td>
          <td class="p-3 font-mono text-xs">${m.rtf.toFixed(4)}</td>
          <td class="p-3 font-mono text-xs">${m.speedup_x.toFixed(0)}×</td>
          <td class="p-3 font-mono text-xs">${m.peak_vram_mb.toFixed(0)}</td>
          <td class="p-3 font-mono text-xs font-bold text-indigo-500">${m.overall_score.toFixed(1)}</td>
          <td class="p-3 text-xs">
            <div class="flex items-center gap-1">
              ${formatCodeButton(m.github_url, true)}
              ${formatCheckpointButton(m.checkpoint_url, isBase, true)}
              ${m.paper_url ? `<a href="${m.paper_url}" target="_blank" rel="noopener noreferrer" class="tbl-btn tbl-btn-paper text-[10px] inline-flex items-center gap-0.5 px-1.5 py-0.5">📄 Paper</a>` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderArchBar() {
    const el = document.getElementById('arch-pesq-bar');
    if (!el || !state.data) return;

    const selectedCat = state.arch.selectedCategory || 'all';
    const pTheme = getPlotlyTheme();

    if (selectedCat === 'all') {
      const catMap = {};
      state.data.leaderboard.forEach(m => {
        const cat = m.arch_category;
        if (!catMap[cat]) catMap[cat] = [];
        catMap[cat].push(m.pesq);
      });

      const xCats = Object.keys(catMap).sort();
      const yPesqs = xCats.map(c => {
        const arr = catMap[c];
        return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(3);
      });
      const colors = xCats.map(c => state.data.arch_cat_colors[c] || '#4F46E5');

      const trace = {
        x: xCats,
        y: yPesqs,
        type: 'bar',
        marker: { color: colors, borderRadius: 6 },
        text: yPesqs,
        textposition: 'outside',
        cliponaxis: false
      };

      const layout = {
        ...pTheme,
        title: { text: '<b>Mean Wideband PESQ by Architecture Category</b>', font: { size: 14 } },
        yaxis: { title: 'Mean PESQ ↑', ...pTheme.yaxis },
        margin: { l: 50, r: 20, t: 50, b: 70 },
        height: 380,
        showlegend: false
      };

      Plotly.newPlot(el, [trace], layout, { responsive: true, displayModeBar: false });
    } else {
      const catModels = state.data.leaderboard
        .filter(m => m.arch_category === selectedCat)
        .sort((a, b) => b.pesq - a.pesq);

      const xNames = catModels.map(m => `[${m.system_id || '—'}] ${m.model_name}`);
      const yPesqs = catModels.map(m => m.pesq.toFixed(3));
      const barColor = state.data.arch_cat_colors[selectedCat] || '#4F46E5';

      const trace = {
        x: xNames,
        y: yPesqs,
        type: 'bar',
        marker: { color: barColor, borderRadius: 6 },
        text: yPesqs,
        textposition: 'outside',
        cliponaxis: false
      };

      const layout = {
        ...pTheme,
        title: { text: `<b>Wideband PESQ for ${selectedCat} Models (${catModels.length} models)</b>`, font: { size: 14 } },
        yaxis: { title: 'PESQ ↑', ...pTheme.yaxis },
        margin: { l: 50, r: 20, t: 50, b: 90 },
        height: 380,
        showlegend: false
      };

      Plotly.newPlot(el, [trace], layout, { responsive: true, displayModeBar: false });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TAB 8 — DIAGNOSTICS (MFA Phoneme QC)
  // ═══════════════════════════════════════════════════════════════════════════
  const diagRadarState = {
    rotation: 0,
    maxR: 12,
    batchIndex: 0,
    batches: [
      ['Vocos', 'Flow2GAN (4-step)', 'RNDVoC', 'BridgeVoC', 'BigVGAN-v2 (112M)'],
      ['PeriodWave-Turbo (4-step)', 'ComVo-Base', 'BigVGAN-Base (14M)', 'ComVo-Large', 'WaveFM (1-step)'],
      ['HiFi-GAN (Universal V1)', 'FreeV', 'RFWave', 'PeriodWave (16-step)', 'Griffin-Lim STFT']
    ]
  };

  const diagTableState = {
    view: 'table', // 'table' | 'matrix' | 'html'
    modelFilter: 'all',
    classFilter: 'all'
  };

  function initDiagRadarControls() {
    const rotLeft = document.getElementById('diag-radar-rot-left');
    const rotRight = document.getElementById('diag-radar-rot-right');
    const zoomIn = document.getElementById('diag-radar-zoom-in');
    const zoomOut = document.getElementById('diag-radar-zoom-out');
    const resetBtn = document.getElementById('diag-radar-reset');
    const prevModels = document.getElementById('diag-radar-prev-models');
    const nextModels = document.getElementById('diag-radar-next-models');
    const badge = document.getElementById('diag-radar-angle-badge');
    const batchBadge = document.getElementById('diag-radar-batch-badge');
    const el = document.getElementById('diag-radar-chart');

    if (!rotLeft || rotLeft.dataset.initialized) return;

    rotLeft.addEventListener('click', () => {
      diagRadarState.rotation = (diagRadarState.rotation + 45) % 360;
      if (badge) badge.textContent = `${diagRadarState.rotation}°`;
      if (el && el.data) Plotly.relayout(el, { 'polar.angularaxis.rotation': diagRadarState.rotation });
    });

    rotRight.addEventListener('click', () => {
      diagRadarState.rotation = (diagRadarState.rotation - 45 + 360) % 360;
      if (badge) badge.textContent = `${diagRadarState.rotation}°`;
      if (el && el.data) Plotly.relayout(el, { 'polar.angularaxis.rotation': diagRadarState.rotation });
    });

    zoomIn.addEventListener('click', () => {
      diagRadarState.maxR = Math.max(3, Math.round(diagRadarState.maxR * 0.75));
      if (el && el.data) Plotly.relayout(el, { 'polar.radialaxis.range': [0, diagRadarState.maxR] });
    });

    zoomOut.addEventListener('click', () => {
      diagRadarState.maxR = Math.min(30, Math.round(diagRadarState.maxR * 1.33));
      if (el && el.data) Plotly.relayout(el, { 'polar.radialaxis.range': [0, diagRadarState.maxR] });
    });

    if (prevModels) {
      prevModels.addEventListener('click', () => {
        diagRadarState.batchIndex = (diagRadarState.batchIndex - 1 + diagRadarState.batches.length) % diagRadarState.batches.length;
        renderDiagRadar();
      });
    }

    if (nextModels) {
      nextModels.addEventListener('click', () => {
        diagRadarState.batchIndex = (diagRadarState.batchIndex + 1) % diagRadarState.batches.length;
        renderDiagRadar();
      });
    }

    resetBtn.addEventListener('click', () => {
      diagRadarState.rotation = 0;
      diagRadarState.maxR = 12;
      diagRadarState.batchIndex = 0;
      renderDiagRadar();
    });

    rotLeft.dataset.initialized = 'true';
  }

  function initDiagTableControls() {
    const modelSelect = document.getElementById('diag-model-filter');
    const classSelect = document.getElementById('diag-class-filter');
    const btnTable = document.getElementById('diag-view-btn-table');
    const btnMatrix = document.getElementById('diag-view-btn-matrix');
    const btnHtml = document.getElementById('diag-view-btn-html');

    const tableContainer = document.getElementById('diag-plotly-table-container');
    const matrixContainer = document.getElementById('diag-plotly-matrix-container');
    const htmlContainer = document.getElementById('diag-html-table-container');

    if (modelSelect && !modelSelect.dataset.initialized && state.data) {
      const models = state.data.leaderboard.map(m => m.model_name);
      modelSelect.innerHTML = `<option value="all">All 15 Models</option>` +
        models.map(m => `<option value="${m}">${m}</option>`).join('');

      modelSelect.addEventListener('change', (e) => {
        diagTableState.modelFilter = e.target.value;
        renderDiagPlotlyTable();
        renderDiagTable();
      });
      modelSelect.dataset.initialized = 'true';
    }

    if (classSelect && !classSelect.dataset.initialized) {
      classSelect.addEventListener('change', (e) => {
        diagTableState.classFilter = e.target.value;
        renderDiagPlotlyTable();
        renderDiagTable();
      });
      classSelect.dataset.initialized = 'true';
    }

    function setView(view) {
      diagTableState.view = view;
      [btnTable, btnMatrix, btnHtml].forEach(b => {
        if (!b) return;
        b.className = 'px-2.5 py-1 rounded-md font-semibold text-slate-400 hover:text-slate-200 transition cursor-pointer';
      });

      if (view === 'table') {
        if (btnTable) btnTable.className = 'px-2.5 py-1 rounded-md font-semibold bg-indigo-600 text-white transition cursor-pointer';
        if (tableContainer) tableContainer.classList.remove('hidden');
        if (matrixContainer) matrixContainer.classList.add('hidden');
        if (htmlContainer) htmlContainer.classList.add('hidden');
        renderDiagPlotlyTable();
      } else if (view === 'matrix') {
        if (btnMatrix) btnMatrix.className = 'px-2.5 py-1 rounded-md font-semibold bg-indigo-600 text-white transition cursor-pointer';
        if (tableContainer) tableContainer.classList.add('hidden');
        if (matrixContainer) matrixContainer.classList.remove('hidden');
        if (htmlContainer) htmlContainer.classList.add('hidden');
        renderDiagHeatmap();
      } else {
        if (btnHtml) btnHtml.className = 'px-2.5 py-1 rounded-md font-semibold bg-indigo-600 text-white transition cursor-pointer';
        if (tableContainer) tableContainer.classList.add('hidden');
        if (matrixContainer) matrixContainer.classList.add('hidden');
        if (htmlContainer) htmlContainer.classList.remove('hidden');
        renderDiagTable();
      }
    }

    if (btnTable && !btnTable.dataset.initialized) {
      btnTable.addEventListener('click', () => setView('table'));
      btnMatrix.addEventListener('click', () => setView('matrix'));
      btnHtml.addEventListener('click', () => setView('html'));
      btnTable.dataset.initialized = 'true';
    }
  }

  function renderDiagnostics() {
    initDiagRadarControls();
    initDiagTableControls();
    renderDiagRadar();
    renderDiagBar();
    renderDiagPlotlyTable();
    renderDiagHeatmap();
    renderDiagTable();
  }

  function renderDiagRadar() {
    const el = document.getElementById('diag-radar-chart');
    const badge = document.getElementById('diag-radar-angle-badge');
    const batchBadge = document.getElementById('diag-radar-batch-badge');
    if (!el || !state.data) return;

    if (badge) badge.textContent = `${diagRadarState.rotation}°`;
    if (batchBadge) batchBadge.textContent = `Batch ${diagRadarState.batchIndex + 1}/${diagRadarState.batches.length}`;

    const cats = ['Vowels', 'Stops / Plosives', 'Fricatives', 'Affricates', 'Nasals', 'Liquids', 'Glides'];
    const models = diagRadarState.batches[diagRadarState.batchIndex] || state.diagnostics.selectedModels;

    const traces = models.map((mName, i) => {
      const sub = state.data.phoneme_diagnostics.filter(r => r.model_name === mName);
      const valMap = {};
      sub.forEach(r => { valMap[r.phonetic_class] = r.lsd_db; });
      const rVals = cats.map(c => valMap[c] || 0);
      rVals.push(rVals[0]);

      const m = state.data.leaderboard.find(x => x.model_name === mName);
      const color = (m && state.data.family_colors[m.architecture_family]) || '#4F46E5';

      return {
        type: 'scatterpolar',
        r: rVals,
        theta: [...cats, cats[0]],
        name: `[${m ? m.system_id : '—'}] ${mName}`,
        line: { color: color, width: 2.2 },
        fill: 'toself',
        fillcolor: color + '15'
      };
    });

    const pTheme = getPlotlyTheme();
    const layout = {
      ...pTheme,
      polar: {
        radialaxis: { visible: true, range: [0, diagRadarState.maxR], gridcolor: pTheme.xaxis.gridcolor },
        angularaxis: { rotation: diagRadarState.rotation, gridcolor: pTheme.xaxis.gridcolor }
      },
      title: { text: `<b>Phoneme-Resolved Log-Spectral Distance (dB) — Batch ${diagRadarState.batchIndex + 1}</b>`, font: { size: 13 } },
      margin: { l: 60, r: 60, t: 50, b: 70 },
      height: 480,
      legend: { orientation: 'h', y: -0.15, x: 0.5, xanchor: 'center', font: { size: 10 } }
    };

    Plotly.newPlot(el, traces, layout, { responsive: true, displayModeBar: false });
  }

  function renderDiagBar() {
    const el = document.getElementById('diag-bar-chart');
    if (!el || !state.data) return;

    const metric = state.diagnostics.metric;
    const cats = ['Vowels', 'Stops / Plosives', 'Fricatives', 'Affricates', 'Nasals', 'Liquids', 'Glides'];

    // Group by architecture family
    const families = [...new Set(state.data.phoneme_diagnostics.map(r => r.family))];

    const traces = families.map(fam => {
      const yVals = cats.map(c => {
        const matches = state.data.phoneme_diagnostics.filter(r => r.family === fam && r.phonetic_class === c);
        if (matches.length === 0) return 0;
        return matches.reduce((a, b) => a + b[metric], 0) / matches.length;
      });

      return {
        name: fam,
        x: cats,
        y: yVals,
        type: 'bar',
        marker: { color: state.data.family_colors[fam] || '#4F46E5' }
      };
    });

    const pTheme = getPlotlyTheme();
    const layout = {
      ...pTheme,
      barmode: 'group',
      title: { text: `<b>Phonetic Error by Category — ${metric.toUpperCase()}</b>`, font: { size: 14 } },
      margin: { l: 60, r: 40, t: 50, b: 120 },
      height: 460,
      legend: { orientation: 'h', y: -0.35, x: 0.5, xanchor: 'center' }
    };

    Plotly.newPlot(el, traces, layout, { responsive: true, displayModeBar: false });
  }

  function renderDiagPlotlyTable() {
    const el = document.getElementById('diag-plotly-table');
    if (!el || !state.data) return;

    let data = state.data.phoneme_diagnostics || [];
    if (diagTableState.modelFilter !== 'all') {
      data = data.filter(r => r.model_name === diagTableState.modelFilter);
    }
    if (diagTableState.classFilter !== 'all') {
      data = data.filter(r => r.phonetic_class === diagTableState.classFilter);
    }

    const isDark = state.theme === 'dark';

    function getLsdCellColor(val) {
      if (val < 4.0) return isDark ? 'rgba(16, 185, 129, 0.28)' : 'rgba(16, 185, 129, 0.2)'; // Green
      if (val < 6.5) return isDark ? 'rgba(6, 182, 212, 0.28)' : 'rgba(6, 182, 212, 0.2)'; // Cyan
      if (val < 8.5) return isDark ? 'rgba(245, 158, 11, 0.28)' : 'rgba(245, 158, 11, 0.2)'; // Amber
      return isDark ? 'rgba(244, 63, 94, 0.28)' : 'rgba(244, 63, 94, 0.2)'; // Rose/Red
    }

    const colSystemId = data.map(r => r.system_id || '—');
    const colModelName = data.map(r => r.model_name);
    const colClass = data.map(r => r.phonetic_class);
    const colLsd = data.map(r => r.lsd_db.toFixed(3));
    const colF0 = data.map(r => r.f0_error_cents.toFixed(1) + ' ¢');
    const colBoundary = data.map(r => r.boundary_error_db.toFixed(2) + ' dB');

    const defaultCellBg = data.map((r, i) => {
      const isBase = r.system_id === 'Baseline' || r.model_name.includes('Griffin-Lim');
      if (isBase) return isDark ? 'rgba(71, 85, 105, 0.35)' : 'rgba(203, 213, 225, 0.5)';
      return i % 2 === 0
        ? (isDark ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.95)')
        : (isDark ? 'rgba(30, 41, 59, 0.55)' : 'rgba(241, 245, 249, 0.85)');
    });

    const lsdCellBg = data.map(r => getLsdCellColor(r.lsd_db));

    const trace = {
      type: 'table',
      columnwidth: [55, 160, 120, 95, 95, 110],
      header: {
        values: ['<b>ID</b>', '<b>Model Name</b>', '<b>Phonetic Class</b>', '<b>LSD (dB) ↓</b>', '<b>F0 Error (¢)</b>', '<b>Boundary Error (dB)</b>'],
        align: ['center', 'left', 'left', 'right', 'right', 'right'],
        fill: { color: isDark ? '#1e293b' : '#e2e8f0' },
        font: { family: 'Inter, -apple-system, sans-serif', size: 12, color: isDark ? '#f8fafc' : '#0f172a' },
        height: 34,
        line: { color: isDark ? '#334155' : '#cbd5e1', width: 1 }
      },
      cells: {
        values: [colSystemId, colModelName, colClass, colLsd, colF0, colBoundary],
        align: ['center', 'left', 'left', 'right', 'right', 'right'],
        fill: {
          color: [
            defaultCellBg,
            defaultCellBg,
            defaultCellBg,
            lsdCellBg,
            defaultCellBg,
            defaultCellBg
          ]
        },
        font: {
          family: 'Inter, monospace, -apple-system, sans-serif',
          size: 11,
          color: isDark ? '#f1f5f9' : '#1e293b'
        },
        height: 28,
        line: { color: isDark ? '#1e293b' : '#e2e8f0', width: 1 }
      }
    };

    const pTheme = getPlotlyTheme();
    const layout = {
      ...pTheme,
      title: { text: `<b>Phoneme Diagnostics Interactive Table (${data.length} records)</b>`, font: { size: 13 } },
      margin: { l: 10, r: 10, t: 36, b: 10 },
      height: Math.min(540, Math.max(260, data.length * 28 + 90))
    };

    Plotly.newPlot(el, [trace], layout, { responsive: true, displayModeBar: false });
  }

  function renderDiagHeatmap() {
    const el = document.getElementById('diag-plotly-heatmap');
    if (!el || !state.data) return;

    const cats = ['Vowels', 'Stops / Plosives', 'Fricatives', 'Affricates', 'Nasals', 'Liquids', 'Glides'];
    const models = state.data.leaderboard.map(m => m.model_name);

    const zValues = models.map(mName => {
      const sub = state.data.phoneme_diagnostics.filter(r => r.model_name === mName);
      const valMap = {};
      sub.forEach(r => { valMap[r.phonetic_class] = r.lsd_db; });
      return cats.map(c => (valMap[c] !== undefined ? valMap[c] : null));
    });

    const isDark = state.theme === 'dark';
    const trace = {
      z: zValues,
      x: cats,
      y: models,
      type: 'heatmap',
      colorscale: [
        [0.0, '#10B981'],
        [0.35, '#06B6D4'],
        [0.65, '#F59E0B'],
        [1.0, '#EF4444']
      ],
      colorbar: { title: 'LSD (dB) ↓', titleside: 'right' },
      hoverongaps: false
    };

    const pTheme = getPlotlyTheme();
    const layout = {
      ...pTheme,
      title: { text: '<b>Phoneme-Resolved Log-Spectral Distance Matrix (dB)</b>', font: { size: 13 } },
      margin: { l: 160, r: 50, t: 40, b: 60 },
      height: 480,
      xaxis: { title: 'Phonetic Class', ...pTheme.xaxis },
      yaxis: { title: 'Model', autorange: 'reversed', ...pTheme.yaxis }
    };

    Plotly.newPlot(el, [trace], layout, { responsive: true, displayModeBar: false });
  }

  function renderDiagTable() {
    const tbody = document.getElementById('diag-table-body');
    if (!tbody || !state.data) return;

    let data = state.data.phoneme_diagnostics || [];
    if (diagTableState.modelFilter !== 'all') {
      data = data.filter(r => r.model_name === diagTableState.modelFilter);
    }
    if (diagTableState.classFilter !== 'all') {
      data = data.filter(r => r.phonetic_class === diagTableState.classFilter);
    }

    tbody.innerHTML = data.map(r => {
      const isBase = r.system_id === 'Baseline' || r.model_name.includes('Griffin-Lim');
      const rowStyle = isBase ? 'style="background-color: rgba(148, 163, 184, 0.25);"' : '';
      return `
        <tr class="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50" ${rowStyle}>
          <td class="p-3 font-mono font-bold text-xs"><span class="px-1.5 py-0.5 rounded text-[11px] ${isBase ? 'bg-slate-700 text-slate-200 border border-slate-600' : 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/50'}">${r.system_id || '—'}</span></td>
          <td class="p-3 font-semibold text-xs">${r.model_name}</td>
          <td class="p-3 text-xs text-indigo-400 font-semibold">${r.phonetic_class}</td>
          <td class="p-3 font-mono text-xs font-bold">${r.lsd_db.toFixed(3)}</td>
          <td class="p-3 font-mono text-xs">${r.f0_error_cents.toFixed(1)}</td>
          <td class="p-3 font-mono text-xs">${r.boundary_error_db.toFixed(2)}</td>
        </tr>
      `;
    }).join('');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TAB 9 — PARETO FRONTIER
  // ═══════════════════════════════════════════════════════════════════════════
  function renderPareto() {
    const xSelect = document.getElementById('pareto-x-select');
    const ySelect = document.getElementById('pareto-y-select');
    const logChk = document.getElementById('pareto-log-chk');
    const pfChk = document.getElementById('pareto-pf-chk');

    if (xSelect) {
      xSelect.value = state.pareto.xCol;
      xSelect.onchange = (e) => { state.pareto.xCol = e.target.value; renderParetoPlot(); };
    }
    if (ySelect) {
      ySelect.value = state.pareto.yCol;
      ySelect.onchange = (e) => { state.pareto.yCol = e.target.value; renderParetoPlot(); };
    }
    if (logChk) {
      logChk.checked = state.pareto.logX;
      logChk.onchange = (e) => { state.pareto.logX = e.target.checked; renderParetoPlot(); };
    }
    if (pfChk) {
      pfChk.checked = state.pareto.showPareto;
      pfChk.onchange = (e) => { state.pareto.showPareto = e.target.checked; renderParetoPlot(); };
    }

    renderParetoPlot();
  }

  function renderParetoPlot() {
    const el = document.getElementById('pareto-scatter-chart');
    if (!el || !state.data) return;

    const xCol = state.pareto.xCol;
    const yCol = state.pareto.yCol;

    const isYOverall = yCol === 'overall_score';
    const yDisplayName = isYOverall ? 'PRISM-V Score' : yCol.toUpperCase();
    const yRainbowHtml = isYOverall
      ? '<span style="color:#6366f1">P</span><span style="color:#06b6d4">R</span><span style="color:#10b981">I</span><span style="color:#f59e0b">S</span><span style="color:#f43f5e">M</span>-V Score'
      : yCol.toUpperCase();

    const families = [...new Set(state.data.leaderboard.map(m => m.architecture_family))].sort();

    const traces = families.map(fam => {
      const sub = state.data.leaderboard.filter(m => m.architecture_family === fam);
      return {
        type: 'scatter',
        mode: 'markers+text',
        name: fam,
        x: sub.map(m => m[xCol]),
        y: sub.map(m => m[yCol]),
        text: sub.map(m => `[${m.system_id || '—'}] ${m.model_name}`),
        textposition: 'top center',
        textfont: { size: 9, family: 'Inter, sans-serif' },
        marker: {
          size: 13,
          color: state.data.family_colors[fam] || '#4F46E5',
          opacity: 0.9,
          line: { width: 1.5, color: '#FFFFFF' }
        },
        hoverinfo: 'text',
        hovertext: sub.map(m => `
          <b>[${m.system_id || '—'}] ${m.model_name}</b><br>
          ${xCol.toUpperCase()}: ${m[xCol]} · ${yDisplayName}: ${m[yCol]}<br>
          Speedup: ${m.speedup_x}× · VRAM: ${m.peak_vram_mb} MB
        `)
      };
    });

    if (state.pareto.showPareto) {
      const pfModels = state.data.leaderboard.filter(m => m.is_pareto).sort((a, b) => a[xCol] - b[xCol]);
      if (pfModels.length > 1) {
        traces.push({
          type: 'scatter',
          mode: 'lines',
          name: 'Pareto Frontier ⭐',
          x: pfModels.map(m => m[xCol]),
          y: pfModels.map(m => m[yCol]),
          line: { color: '#DC2626', width: 2.5, dash: 'dash' },
          hoverinfo: 'skip'
        });
      }
    }

    const pTheme = getPlotlyTheme();
    const layout = {
      ...pTheme,
      title: { text: `<b>${yRainbowHtml} vs ${xCol.toUpperCase()} — Multi-Objective Tradeoff</b>`, font: { size: 14 } },
      xaxis: {
        title: xCol.toUpperCase(),
        type: state.pareto.logX && ['rtf', 'params_m'].includes(xCol) ? 'log' : 'linear',
        ...pTheme.xaxis
      },
      yaxis: { title: yRainbowHtml, ...pTheme.yaxis },
      margin: { l: 60, r: 40, t: 50, b: 120 },
      height: 540,
      legend: { orientation: 'h', y: -0.28, x: 0.5, xanchor: 'center', font: { size: 10 } }
    };

    Plotly.newPlot(el, traces, layout, { responsive: true, displayModeBar: false });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TAB 10 — MODELS (Model Registry)
  // ═══════════════════════════════════════════════════════════════════════════
  function renderModelCard() {
    const select = document.getElementById('model-card-select');
    const container = document.getElementById('model-card-details-container');
    if (!select || !container || !state.data) return;

    select.innerHTML = state.data.leaderboard.map(m => `
      <option value="${m.model_name}">[${m.system_id || '—'}] ${m.model_name}</option>
    `).join('');
    select.value = state.modelCard.selectedModel;

    select.onchange = (e) => {
      state.modelCard.selectedModel = e.target.value;
      renderModelCard();
    };

    const m = state.data.leaderboard.find(x => x.model_name === state.modelCard.selectedModel);
    if (!m) return;

    const color = state.data.family_colors[m.architecture_family] || '#4F46E5';

    container.innerHTML = `
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
          <div>
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded-md text-xs font-mono font-bold ${m.is_baseline ? 'bg-slate-700 text-slate-200 border border-slate-600' : 'bg-indigo-900/80 text-indigo-300 border border-indigo-700/60'}">
                ${m.system_id || '—'}
              </span>
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white">${m.model_name}</h2>
              <span class="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
                ${m.model_id}
              </span>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
              <span class="font-semibold" style="color:${color}">${m.architecture_family}</span> · ${m.arch_category} · ${m.track} · Year ${m.year}
            </p>
          </div>
          <div class="flex items-center gap-2">
            ${m.github_url ? `<a href="${m.github_url}" target="_blank" rel="noopener noreferrer" class="tbl-btn tbl-btn-gh">💻 GitHub</a>` : ''}
            ${m.checkpoint_url && !m.checkpoint_url.startsWith('N/A') ? `<a href="${m.checkpoint_url}" target="_blank" rel="noopener noreferrer" class="tbl-btn tbl-btn-ckpt">📦 Checkpoint</a>` : ''}
            ${m.paper_url ? `<a href="${m.paper_url}" target="_blank" rel="noopener noreferrer" class="audio-card-btn">📄 Paper</a>` : ''}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <h3 class="font-bold text-xs uppercase text-slate-400 tracking-wider mb-3">Model Specifications</h3>
            <div class="space-y-2 text-xs">
              <div class="flex justify-between"><span>System ID:</span><span class="font-mono font-bold text-indigo-400">${m.system_id || '—'}</span></div>
              <div class="flex justify-between"><span>Code License:</span><span class="font-mono font-bold">${m.license}</span></div>
              <div class="flex justify-between"><span>Sampling Rate:</span><span class="font-mono">${m.sampling_rate_hz} Hz</span></div>
              <div class="flex justify-between"><span>Parameters:</span><span class="font-mono font-bold">${m.params_m.toFixed(1)} M</span></div>
              <div class="flex justify-between"><span>Edge Feasible:</span><span>${m.edge_feasible === 'Yes' ? '✅ Yes' : '❌ No'}</span></div>
              <div class="flex justify-between"><span>Pareto Optimal:</span><span>${m.is_pareto ? '⭐ Yes' : 'No'}</span></div>
            </div>
          </div>

          <div class="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <h3 class="font-bold text-xs uppercase text-slate-400 tracking-wider mb-3">Quality & Fidelity</h3>
            <div class="space-y-2 text-xs">
              <div class="flex justify-between"><span><span class="prism-rainbow-text font-bold"><span style="color:#6366f1">P</span><span style="color:#06b6d4">R</span><span style="color:#10b981">I</span><span style="color:#f59e0b">S</span><span style="color:#f43f5e">M</span>-V</span> Score:</span><span class="font-mono font-bold text-indigo-500">${m.overall_score.toFixed(1)} / 100</span></div>
              <div class="flex justify-between"><span>Wideband PESQ:</span><span class="font-mono font-bold">${m.pesq.toFixed(3)}</span></div>
              <div class="flex justify-between"><span>STOI Intelligibility:</span><span class="font-mono">${m.stoi.toFixed(3)}</span></div>
              <div class="flex justify-between"><span>UTMOS Neural MOS:</span><span class="font-mono text-purple-500 font-bold">${m.utmos.toFixed(2)}</span></div>
              <div class="flex justify-between"><span>ASR Degradation (ΔWER):</span><span class="font-mono">${m.delta_wer_pct.toFixed(2)}%</span></div>
            </div>
          </div>

          <div class="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <h3 class="font-bold text-xs uppercase text-slate-400 tracking-wider mb-3">Edge Profiling Efficiency</h3>
            <div class="space-y-2 text-xs">
              <div class="flex justify-between"><span>Real-Time Factor (RTF):</span><span class="font-mono font-bold text-amber-500">${m.rtf.toFixed(4)}</span></div>
              <div class="flex justify-between"><span>Throughput (xRT):</span><span class="font-mono font-bold text-amber-500">${m.speedup_x.toFixed(0)}×</span></div>
              <div class="flex justify-between"><span>Peak GPU VRAM:</span><span class="font-mono">${m.peak_vram_mb.toFixed(0)} MB</span></div>
              <div class="flex justify-between"><span>Code Open-Source:</span><span>${m.code_open ? '✅ Yes' : '❌ Closed'}</span></div>
              <div class="flex justify-between"><span>Checkpoint Open:</span><span>${m.ckpt_open ? '✅ Yes' : '❌ Closed'}</span></div>
            </div>
          </div>
        </div>

        <h3 class="font-bold text-sm text-slate-900 dark:text-white mb-3">Per-Corpus Acoustic Breakdown</h3>
        <div class="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table class="w-full text-xs text-left">
            <thead class="bg-slate-100 dark:bg-slate-800 uppercase text-slate-500">
              <tr>
                <th class="p-3">Corpus</th>
                <th class="p-3">Acoustic Condition</th>
                <th class="p-3">PESQ ↑</th>
                <th class="p-3">STOI ↑</th>
                <th class="p-3">LSD (dB) ↓</th>
                <th class="p-3">MCD (dB) ↓</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
              ${['LJSpeech', 'LibriTTS', 'VCTK', 'Free_ST'].map(d => {
                const met = m.dataset_metrics && m.dataset_metrics[d];
                return `
                  <tr>
                    <td class="p-3 font-bold text-indigo-500">${d}</td>
                    <td class="p-3 text-slate-400">${state.data.datasets[d] || '—'}</td>
                    <td class="p-3 font-mono font-bold">${met ? met.pesq.toFixed(3) : '—'}</td>
                    <td class="p-3 font-mono">${met ? met.stoi.toFixed(3) : '—'}</td>
                    <td class="p-3 font-mono">${met ? met.lsd_db.toFixed(2) : '—'}</td>
                    <td class="p-3 font-mono">${met ? met.mcd_db.toFixed(2) : '—'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TAB 11 & 12 — METHODOLOGY & CHANGELOG
  // ═══════════════════════════════════════════════════════════════════════════
  function colorizePrismV(text) {
    if (!text) return '';
    const prismColored = '<span class="prism-rainbow-text font-bold"><span style="color:#6366f1">P</span><span style="color:#06b6d4">R</span><span style="color:#10b981">I</span><span style="color:#f59e0b">S</span><span style="color:#f43f5e">M</span>-V</span>';
    return text.replace(/PRISM-V/g, prismColored);
  }

  function renderMethodology() {
    // Populate metric definitions table
    const tbody = document.getElementById('metric-defs-table-body');
    if (!tbody || !state.data) return;

    tbody.innerHTML = Object.entries(state.data.metric_defs).map(([key, def]) => `
      <tr class="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
        <td class="p-3 font-bold text-xs text-indigo-500">${key}</td>
        <td class="p-3 font-semibold text-xs">${colorizePrismV(def.title)}</td>
        <td class="p-3 font-mono text-xs">${def.direction}</td>
        <td class="p-3 text-xs text-slate-600 dark:text-slate-400">${colorizePrismV(def.description)}</td>
      </tr>
    `).join('');
  }

  function colorizeBibtex(text) {
    if (!text) return '';
    const prismColored = '<span style="font-weight:700;"><span style="color:#6366f1">P</span><span style="color:#06b6d4">R</span><span style="color:#10b981">I</span><span style="color:#f59e0b">S</span><span style="color:#f43f5e">M</span>-V</span>';
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return escaped.replace(/PRISM-V/g, prismColored);
  }

  function renderChangelog() {
    const bibtexEl = document.getElementById('bibtex-code-block');
    const bottomBibtexEl = document.getElementById('bottom-bibtex-code-block');
    if (bibtexEl && state.data && state.data.bibtex) {
      bibtexEl.innerHTML = colorizeBibtex(state.data.bibtex);
    }
    if (bottomBibtexEl && state.data && state.data.bibtex) {
      bottomBibtexEl.innerHTML = colorizeBibtex(state.data.bibtex);
    }
  }

  window.copyBibTeX = function (targetId = 'bottom-bibtex-code-block') {
    const el = document.getElementById(targetId);
    if (!el) return;
    const textToCopy = (state.data && state.data.bibtex) ? state.data.bibtex : el.textContent.trim();
    navigator.clipboard.writeText(textToCopy).then(() => {
      const buttons = document.querySelectorAll(`button[onclick*="${targetId}"]`);
      buttons.forEach(btn => {
        const originalText = btn.innerHTML;
        btn.innerHTML = '✓ Copied!';
        btn.classList.add('!bg-emerald-600', '!text-white', '!border-emerald-500');
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('!bg-emerald-600', '!text-white', '!border-emerald-500');
        }, 2000);
      });
    }).catch(() => {
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    });
  };

  // ── Global App Bootstrapping ───────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(state.theme);
    applyFontLevel(state.fontLevel);

    // Read URL hash
    const initialTab = window.location.hash.replace('#', '') || 'overview';
    switchTab(initialTab, false);

    window.addEventListener('popstate', () => {
      const tab = window.location.hash.replace('#', '') || 'overview';
      switchTab(tab, false);
    });

    window.addEventListener('resize', () => {
      if (state.activeTab === 'audio-explorer') {
        updateAudioExplorer();
      }
    });

    initData();
  });

})();

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
    renderModelCard();
    renderMethodology();
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
      'diag-bar-chart', 'pareto-scatter-chart'
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
    else if (tabId === 'diagnostics') { renderDiagRadar(); renderDiagBar(); }
    else if (tabId === 'pareto') renderParetoPlot();
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  function formatRankBadge(rank, score) {
    let medal = '';
    let cls = 'rank-regular';
    if (rank === 1) { medal = '🥇'; cls = 'rank-gold'; }
    else if (rank === 2) { medal = '🥈'; cls = 'rank-silver'; }
    else if (rank === 3) { medal = '🥉'; cls = 'rank-bronze'; }

    return `
      <div class="rank-score-pill ${cls}">
        ${medal ? `<span class="rank-medal">${medal}</span>` : ''}
        <span class="rank-num">#${rank}</span>
        <span class="text-xs opacity-50">·</span>
        <span class="rank-score">${score.toFixed(1)}</span>
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
  // TAB 1 — OVERVIEW
  // ═══════════════════════════════════════════════════════════════════════════
  function renderOverview() {
    renderOverviewCharts();
  }

  function renderOverviewCharts() {
    const el = document.getElementById('overview-arch-bar');
    if (!el || !state.data) return;

    // Group models by arch_category
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

    const pTheme = getPlotlyTheme();
    const layout = {
      ...pTheme,
      title: { text: '<b>Mean PESQ Across Architectural Paradigms</b>', font: { size: 14 } },
      margin: { l: 50, r: 20, t: 40, b: 60 },
      height: 300,
      showlegend: false
    };

    Plotly.newPlot(el, [trace], layout, { responsive: true, displayModeBar: false });
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

    // Export CSV / JSON buttons
    const exportCsvBtn = document.getElementById('lb-export-csv-btn');
    if (exportCsvBtn) {
      exportCsvBtn.onclick = exportLeaderboardCSV;
    }
    const exportJsonBtn = document.getElementById('lb-export-json-btn');
    if (exportJsonBtn) {
      exportJsonBtn.onclick = exportLeaderboardJSON;
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

  function updateLeaderboardTable() {
    const tbody = document.getElementById('lb-table-body');
    const thead = document.getElementById('lb-table-head');
    const countEl = document.getElementById('lb-model-count');
    if (!tbody || !thead || !state.data) return;

    const list = getFilteredLeaderboard();
    if (countEl) countEl.textContent = `${list.length} / ${state.data.leaderboard.length} models`;

    // Define columns
    const columns = [
      { id: 'rank', label: 'Rank & Score', group: 'prism', sortKey: 'overall_score', always: true },
      { id: 'model_name', label: 'Model', group: 'prism', sortKey: 'model_name', always: true },
      { id: 'pesq', label: 'PESQ ↑', group: 'objective', sortKey: 'pesq', tip: 'Perceptual Evaluation of Speech Quality (ITU-T P.862)' },
      { id: 'stoi', label: 'STOI ↑', group: 'objective', sortKey: 'stoi', tip: 'Short-Time Objective Intelligibility' },
      { id: 'mcd_db', label: 'MCD (dB) ↓', group: 'objective', sortKey: 'mcd_db', tip: 'Mel-Cepstral Distortion' },
      { id: 'lsd_db', label: 'LSD (dB) ↓', group: 'objective', sortKey: 'lsd_db', tip: 'Log-Spectral Distance' },
      { id: 'utmos', label: 'UTMOS ↑', group: 'subjective', sortKey: 'utmos', tip: 'Universal Text-to-speech MOS Predictor' },
      { id: 'nisqa', label: 'NISQA ↑', group: 'subjective', sortKey: 'nisqa', tip: 'Deep Naturalness & Distortion Predictor' },
      { id: 'delta_wer_pct', label: 'ΔWER % ↓', group: 'subjective', sortKey: 'delta_wer_pct', tip: 'Word Error Rate Degradation via Conformer ASR' },
      { id: 'rtf', label: 'RTF ↓', group: 'performance', sortKey: 'rtf', tip: 'Real-Time Factor (Latency / Duration)' },
      { id: 'speedup_x', label: 'xRT ↑', group: 'performance', sortKey: 'speedup_x', tip: 'Throughput Speedup Factor (1/RTF)' },
      { id: 'peak_vram_mb', label: 'VRAM (MB) ↓', group: 'performance', sortKey: 'peak_vram_mb', tip: 'Peak GPU Memory Allocated during Inference' },
      { id: 'params_m', label: 'Params (M)', group: 'performance', sortKey: 'params_m', tip: 'Generator Parameter Count in Millions' },
      { id: 'edge_feasible', label: 'Edge ⚡', group: 'performance', sortKey: 'edge_feasible', tip: 'Edge-Hardware Feasibility Status' },
      { id: 'LJSpeech', label: 'LJSpeech', group: 'robustness', sortKey: 'LJSpeech', tip: 'Single-speaker Clean Studio Reading PESQ' },
      { id: 'LibriTTS', label: 'LibriTTS', group: 'robustness', sortKey: 'LibriTTS', tip: 'Multi-speaker Narrative Audio-book PESQ' },
      { id: 'VCTK', label: 'VCTK', group: 'robustness', sortKey: 'VCTK', tip: 'Regional Accented Speech PESQ' },
      { id: 'Free_ST', label: 'Free_ST', group: 'robustness', sortKey: 'Free_ST', tip: 'Real-world Mobile Noisy PESQ' },
      { id: 'code', label: 'Code', group: 'info', tip: 'Public Code Availability' },
      { id: 'checkpoint', label: 'Checkpoint', group: 'info', tip: 'Pretrained Checkpoint Availability' },
      { id: 'is_pareto', label: 'Pareto ⭐', group: 'info', sortKey: 'is_pareto', tip: 'Non-dominated Pareto Optimal Checkpoint' },
      { id: 'license', label: 'License', group: 'info', sortKey: 'license', tip: 'Open License' },
      { id: 'architecture_family', label: 'Architecture', group: 'info', sortKey: 'architecture_family', tip: 'Architecture Family' },
      { id: 'track', label: 'Track', group: 'info', sortKey: 'track', tip: 'Benchmark Track' },
      { id: 'year', label: 'Year', group: 'info', sortKey: 'year', tip: 'Release Year' }
    ];

    const activeCols = columns.filter(c => c.always || state.lb.visibleCols[c.id]);

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

    tbody.innerHTML = list.map((m, idx) => {
      const rankNum = idx + 1;
      const rankBadge = formatRankBadge(rankNum, m.display_score);

      return `
        <tr>
          ${activeCols.map(c => {
            switch (c.id) {
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
                return `
                  <td>
                    ${m.github_url
                      ? `<a href="${m.github_url}" target="_blank" rel="noopener noreferrer" class="tbl-btn tbl-btn-gh">💻 GitHub</a>`
                      : '<span class="text-xs text-slate-400">—</span>'}
                  </td>
                `;
              case 'checkpoint':
                return `
                  <td>
                    ${m.checkpoint_url && !m.checkpoint_url.startsWith('N/A')
                      ? `<a href="${m.checkpoint_url}" target="_blank" rel="noopener noreferrer" class="tbl-btn tbl-btn-ckpt">📦 Checkpoint</a>`
                      : '<span class="text-xs text-slate-400 italic">Algorithmic</span>'}
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
    state.modelCard.selectedModel = modelName;
    const dd = document.getElementById('model-card-select');
    if (dd) dd.value = modelName;
    renderModelCard();
    switchTab('models');
  };

  function exportLeaderboardCSV() {
    const list = getFilteredLeaderboard();
    if (!list || list.length === 0) return;
    const headers = ['rank', 'model_name', 'architecture_family', 'track', 'score', 'pesq', 'stoi', 'utmos', 'rtf', 'speedup_x', 'vram_mb', 'params_m', 'edge', 'pareto', 'license'];
    const rows = list.map((m, idx) => [
      idx + 1,
      `"${m.model_name}"`,
      `"${m.architecture_family}"`,
      `"${m.track}"`,
      m.display_score.toFixed(1),
      m.computed_pesq.toFixed(3),
      m.stoi.toFixed(3),
      m.utmos.toFixed(2),
      m.rtf.toFixed(4),
      m.speedup_x.toFixed(0),
      m.peak_vram_mb.toFixed(0),
      m.params_m.toFixed(1),
      m.edge_feasible,
      m.is_pareto,
      m.license
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'prism_v_leaderboard_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function exportLeaderboardJSON() {
    const list = getFilteredLeaderboard();
    if (!list || list.length === 0) return;
    const jsonStr = JSON.stringify(list, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'prism_v_leaderboard_data.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      { label: '🏆 PRISM-V Score (1–100) ↑', get: m => m.overall_score.toFixed(1) },
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
      { label: 'License', get: m => m.license }
    ];

    tableEl.innerHTML = `
      <thead>
        <tr>
          <th class="p-3 bg-slate-100 dark:bg-slate-800 text-left font-bold text-xs uppercase">Metric / Dimension</th>
          ${models.map(m => `<th class="p-3 bg-slate-100 dark:bg-slate-800 text-left font-bold text-xs uppercase text-indigo-600 dark:text-indigo-400">${m.model_name}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${rows.map(r => `
          <tr class="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <td class="p-3 font-semibold text-xs text-slate-700 dark:text-slate-300">${r.label}</td>
            ${models.map(m => `<td class="p-3 font-mono text-xs font-bold">${r.get(m)}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    `;
  }

  function renderCompareRadar() {
    const el = document.getElementById('compare-radar');
    if (!el || !state.data) return;

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
        name: m.model_name,
        line: { color: color, width: 2.5 },
        fill: 'toself',
        fillcolor: color + '22'
      };
    });

    const pTheme = getPlotlyTheme();
    const layout = {
      ...pTheme,
      polar: {
        radialaxis: { visible: true, range: [0, 100], gridcolor: pTheme.xaxis.gridcolor },
        angularaxis: { gridcolor: pTheme.xaxis.gridcolor }
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

    // Head-to-Head Banner
    const banner = document.getElementById('audio-head-to-head-banner');
    if (banner && mA && mB) {
      const pesqDiff = mB.pesq - mA.pesq;
      const pesqLead = pesqDiff > 0 ? mB.model_name : mA.model_name;
      const speedFactor = mA.speedup_x >= mB.speedup_x
        ? (mA.speedup_x / Math.max(1, mB.speedup_x))
        : (mB.speedup_x / Math.max(1, mA.speedup_x));
      const speedLead = mA.speedup_x >= mB.speedup_x ? mA.model_name : mB.model_name;

      banner.innerHTML = `
        <div class="compare-diff-banner">
          <div class="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
            📊 Head-to-Head Comparative Diagnostics
          </div>
          <div class="flex flex-wrap items-center gap-6 text-xs">
            <div>
              🏆 <b>Acoustic Quality:</b> <span class="font-bold text-indigo-600 dark:text-indigo-400">${pesqLead}</span> leads Wideband PESQ by <code class="font-bold">${Math.abs(pesqDiff).toFixed(3)}</code>
            </div>
            <div>
              ⚡ <b>Throughput:</b> <span class="font-bold text-amber-600 dark:text-amber-400">${speedLead}</span> is <code class="font-bold">${speedFactor.toFixed(1)}×</code> faster
            </div>
            <div>
              💾 <b>VRAM Usage:</b> <b>${mA.model_name}</b> uses <code>${mA.peak_vram_mb.toFixed(0)} MB</code> vs <b>${mB.model_name}</b> <code>${mB.peak_vram_mb.toFixed(0)} MB</code>
            </div>
          </div>
        </div>
      `;
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

      const trace = {
        z: zValues,
        x: datasets,
        y: models,
        type: 'heatmap',
        colorscale: ['pesq', 'stoi'].includes(metric) ? 'RdYlGn' : 'RdYlGn_r',
        hoverongaps: false,
        colorbar: { title: metric.toUpperCase(), len: 0.9 }
      };

      const layout = {
        ...pTheme,
        title: { text: `<b>Cross-Corpus Generalization Heatmap</b> — ${metric.toUpperCase()}`, font: { size: 14 } },
        margin: { l: 180, r: 60, t: 50, b: 60 },
        height: 520
      };

      Plotly.newPlot(el, [trace], layout, { responsive: true, displayModeBar: false });
    } else {
      // Grouped Bar Chart
      const traces = datasets.map(d => {
        const yVals = models.map(mName => {
          const m = state.data.leaderboard.find(x => x.model_name === mName);
          const mObj = m && m.dataset_metrics && m.dataset_metrics[d];
          return mObj ? mObj[metric] : 0;
        });

        return {
          name: d,
          x: models,
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

    tbody.innerHTML = state.data.dataset_breakdown.map(r => `
      <tr class="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
        <td class="p-3 font-semibold text-xs">${r.model_name}</td>
        <td class="p-3 text-xs text-indigo-500 font-semibold">${r.dataset}</td>
        <td class="p-3 font-mono text-xs font-bold">${r.pesq.toFixed(3)}</td>
        <td class="p-3 font-mono text-xs">${r.stoi.toFixed(3)}</td>
        <td class="p-3 font-mono text-xs">${r.lsd_db.toFixed(2)}</td>
        <td class="p-3 font-mono text-xs">${r.mcd_db.toFixed(2)}</td>
      </tr>
    `).join('');
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
      y: sorted.map(m => m.model_name),
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
      margin: { l: 180, r: 80, t: 50, b: 60 },
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

    tbody.innerHTML = state.data.leaderboard.map(m => `
      <tr class="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
        <td class="p-3 font-semibold text-xs">${m.model_name}</td>
        <td class="p-3 text-xs text-slate-400">${m.architecture_family}</td>
        <td class="p-3 font-mono text-xs font-bold text-amber-500">${m.rtf.toFixed(4)}</td>
        <td class="p-3 font-mono text-xs font-bold text-amber-500">${m.speedup_x.toFixed(0)}×</td>
        <td class="p-3 font-mono text-xs">${m.peak_vram_mb.toFixed(0)} MB</td>
        <td class="p-3 font-mono text-xs">${m.params_m.toFixed(1)} M</td>
        <td class="p-3 text-xs">${m.edge_feasible === 'Yes' ? '✅ Ready' : '❌ High-VRAM'}</td>
        <td class="p-3 text-xs">${m.code_open ? '✅ Open' : '❌ Closed'}</td>
        <td class="p-3 text-xs">${m.ckpt_open ? '✅ Open' : '❌ Closed'}</td>
      </tr>
    `).join('');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TAB 7 — ARCHITECTURES
  // ═══════════════════════════════════════════════════════════════════════════
  function renderArchitectures() {
    renderArchTable();
    renderArchBar();
  }

  function renderArchTable() {
    const tbody = document.getElementById('arch-table-body');
    if (!tbody || !state.data) return;

    tbody.innerHTML = state.data.leaderboard.map(m => `
      <tr class="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
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
      </tr>
    `).join('');
  }

  function renderArchBar() {
    const el = document.getElementById('arch-pesq-bar');
    if (!el || !state.data) return;

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

    const pTheme = getPlotlyTheme();
    const layout = {
      ...pTheme,
      title: { text: '<b>Mean Wideband PESQ by Architecture Category</b>', font: { size: 14 } },
      yaxis: { title: 'Mean PESQ ↑', ...pTheme.yaxis },
      margin: { l: 50, r: 20, t: 50, b: 70 },
      height: 380,
      showlegend: false
    };

    Plotly.newPlot(el, [trace], layout, { responsive: true, displayModeBar: false });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TAB 8 — DIAGNOSTICS (MFA Phoneme QC)
  // ═══════════════════════════════════════════════════════════════════════════
  function renderDiagnostics() {
    renderDiagRadar();
    renderDiagBar();
    renderDiagTable();
  }

  function renderDiagRadar() {
    const el = document.getElementById('diag-radar-chart');
    if (!el || !state.data) return;

    const cats = ['Vowels', 'Stops / Plosives', 'Fricatives', 'Affricates', 'Nasals', 'Liquids', 'Glides'];
    const models = state.diagnostics.selectedModels;

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
        name: mName,
        line: { color: color, width: 2 },
        fill: 'toself',
        fillcolor: color + '15'
      };
    });

    const pTheme = getPlotlyTheme();
    const layout = {
      ...pTheme,
      polar: {
        radialaxis: { visible: true, range: [0, 12], gridcolor: pTheme.xaxis.gridcolor },
        angularaxis: { gridcolor: pTheme.xaxis.gridcolor }
      },
      title: { text: '<b>Phoneme-Resolved Log-Spectral Distance (dB) — lower is better</b>', font: { size: 14 } },
      margin: { l: 60, r: 60, t: 50, b: 70 },
      height: 480,
      legend: { orientation: 'h', y: -0.15, x: 0.5, xanchor: 'center' }
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

  function renderDiagTable() {
    const tbody = document.getElementById('diag-table-body');
    if (!tbody || !state.data) return;

    tbody.innerHTML = state.data.phoneme_diagnostics.map(r => `
      <tr class="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
        <td class="p-3 font-semibold text-xs">${r.model_name}</td>
        <td class="p-3 text-xs text-indigo-400">${r.phonetic_class}</td>
        <td class="p-3 font-mono text-xs font-bold">${r.lsd_db.toFixed(3)}</td>
        <td class="p-3 font-mono text-xs">${r.f0_error_cents.toFixed(1)}</td>
        <td class="p-3 font-mono text-xs">${r.boundary_error_db.toFixed(2)}</td>
      </tr>
    `).join('');
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

    const families = [...new Set(state.data.leaderboard.map(m => m.architecture_family))].sort();

    const traces = families.map(fam => {
      const sub = state.data.leaderboard.filter(m => m.architecture_family === fam);
      return {
        type: 'scatter',
        mode: 'markers+text',
        name: fam,
        x: sub.map(m => m[xCol]),
        y: sub.map(m => m[yCol]),
        text: sub.map(m => m.model_name),
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
          <b>${m.model_name}</b><br>
          ${xCol.toUpperCase()}: ${m[xCol]} · ${yCol.toUpperCase()}: ${m[yCol]}<br>
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
      title: { text: `<b>${yCol.toUpperCase()} vs ${xCol.toUpperCase()} — Multi-Objective Tradeoff</b>`, font: { size: 14 } },
      xaxis: {
        title: xCol.toUpperCase(),
        type: state.pareto.logX && ['rtf', 'params_m'].includes(xCol) ? 'log' : 'linear',
        ...pTheme.xaxis
      },
      yaxis: { title: yCol.toUpperCase(), ...pTheme.yaxis },
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
      <option value="${m.model_name}">${m.model_name}</option>
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
              <div class="flex justify-between"><span>PRISM-V Score:</span><span class="font-mono font-bold text-indigo-500">${m.overall_score.toFixed(1)} / 100</span></div>
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
  function renderMethodology() {
    // Populate metric definitions table
    const tbody = document.getElementById('metric-defs-table-body');
    if (!tbody || !state.data) return;

    tbody.innerHTML = Object.entries(state.data.metric_defs).map(([key, def]) => `
      <tr class="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
        <td class="p-3 font-bold text-xs text-indigo-500">${key}</td>
        <td class="p-3 font-semibold text-xs">${def.title}</td>
        <td class="p-3 font-mono text-xs">${def.direction}</td>
        <td class="p-3 text-xs text-slate-600 dark:text-slate-400">${def.description}</td>
      </tr>
    `).join('');
  }

  function renderChangelog() {
    const bibtexEl = document.getElementById('bibtex-code-block');
    const bottomBibtexEl = document.getElementById('bottom-bibtex-code-block');
    if (bibtexEl && state.data) bibtexEl.textContent = state.data.bibtex;
    if (bottomBibtexEl && state.data) bottomBibtexEl.textContent = state.data.bibtex;
  }

  window.copyBibTeX = function (targetId = 'bibtex-code-block') {
    const el = document.getElementById(targetId);
    if (!el) return;
    navigator.clipboard.writeText(el.textContent).then(() => {
      alert('BibTeX citation copied to clipboard!');
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

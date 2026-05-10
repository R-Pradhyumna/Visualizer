// Helper to fetch numeric values from DOM
const getVal = (id) => parseFloat(document.getElementById(id).value);

function updatePlot() {
  const fm = getVal("fm_slider");
  const fs = getVal("fs_slider");
  const phase = getVal("phase_slider");

  // UI Logic: Nyquist Status Banner
  const statusBox = document.getElementById("nyquist_status");
  const nyquistRate = 2 * fm;

  if (fs > nyquistRate) {
    statusBox.innerHTML = `✅ Over-sampled<br><small>fs > 2fm (${fs} > ${nyquistRate} Hz)</small>`;
    statusBox.style.backgroundColor = "#d4edda";
    statusBox.style.color = "#155724";
    statusBox.style.borderColor = "#c3e6cb";
  } else if (fs === nyquistRate) {
    statusBox.innerHTML = `⚠️ Critical Sampling<br><small>fs = 2fm (${fs} = ${nyquistRate} Hz)</small>`;
    statusBox.style.backgroundColor = "#fff3cd";
    statusBox.style.color = "#856404";
    statusBox.style.borderColor = "#ffeeba";
  } else {
    statusBox.innerHTML = `🛑 ALIASING OCCURRING<br><small>fs < 2fm (${fs} < ${nyquistRate} Hz)</small>`;
    statusBox.style.backgroundColor = "#f8d7da";
    statusBox.style.color = "#721c24";
    statusBox.style.borderColor = "#f5c6cb";
  }

  // Math: Calculate the Apparent (Aliased) Frequency
  // Formula: fa = | fm - N * fs | where N is the closest integer to fm/fs
  const N = Math.round(fm / fs);
  const f_alias = Math.abs(fm - N * fs);

  // Determine alias phase shift (if N is odd, phase is inverted)
  const alias_phase = N % 2 !== 0 ? -phase : phase;

  // Generate Time Arrays (1 second duration)
  const duration = 1.0;

  // High-resolution time for continuous waves
  const NUM_CONT_POINTS = 1000;
  const t_cont = new Float32Array(NUM_CONT_POINTS);
  const m_cont = new Float32Array(NUM_CONT_POINTS);
  const recon_cont = new Float32Array(NUM_CONT_POINTS);

  for (let i = 0; i < NUM_CONT_POINTS; i++) {
    const t = (i / (NUM_CONT_POINTS - 1)) * duration;
    t_cont[i] = t;
    m_cont[i] = Math.cos(2 * Math.PI * fm * t + phase);
    recon_cont[i] = Math.cos(2 * Math.PI * f_alias * t + alias_phase);
  }

  // Discrete time for sampled points
  const num_samples = Math.floor(duration * fs) + 1;
  const t_samp = new Float32Array(num_samples);
  const m_samp = new Float32Array(num_samples);

  for (let i = 0; i < num_samples; i++) {
    const t = i / fs;
    if (t <= duration) {
      t_samp[i] = t;
      m_samp[i] = Math.cos(2 * Math.PI * fm * t + phase);
    }
  }

  // Traces for Plot 1: Original Signal + Stem Plot of Samples
  const trace_original = {
    x: t_cont,
    y: m_cont,
    type: "scatter",
    mode: "lines",
    name: "Original Signal",
    line: { color: "#0056b3", width: 2 },
  };

  // Plotly doesn't have a native 'stem' plot, so we simulate it with markers and error bars
  const trace_samples = {
    x: t_samp,
    y: m_samp,
    type: "scatter",
    mode: "markers",
    name: "Samples",
    marker: { color: "red", size: 8, line: { color: "black", width: 1 } },
    error_y: {
      type: "data",
      array: m_samp,
      arrayminus: m_samp.map((v) => 0),
      symmetric: false,
      width: 0,
      thickness: 1.5,
      color: "red",
    },
  };

  // Traces for Plot 2: Reconstructed Signal vs Original
  const trace_recon_original = {
    x: t_cont,
    y: m_cont,
    type: "scatter",
    mode: "lines",
    name: "Original",
    line: { color: "rgba(0, 86, 179, 0.3)", width: 2, dash: "dash" },
    xaxis: "x2",
    yaxis: "y2",
  };
  const trace_reconstructed = {
    x: t_cont,
    y: recon_cont,
    type: "scatter",
    mode: "lines",
    name: "Reconstructed",
    line: { color: "#2ca02c", width: 2.5 },
    xaxis: "x2",
    yaxis: "y2",
  };
  const trace_recon_samples = {
    x: t_samp,
    y: m_samp,
    type: "scatter",
    mode: "markers",
    name: "Samples",
    marker: { color: "red", size: 6 },
    xaxis: "x2",
    yaxis: "y2",
    showlegend: false,
  };

  const layout = {
    margin: { l: 60, r: 20, t: 60, b: 50 },
    legend: { orientation: "h", x: 0.5, xanchor: "center", y: 1.15 },

    xaxis: {
      anchor: "y",
      showgrid: true,
      gridcolor: "#e5e5e5",
      range: [0, duration],
    },
    xaxis2: {
      anchor: "y2",
      showgrid: true,
      gridcolor: "#e5e5e5",
      title: "Time (s)",
      range: [0, duration],
    },

    yaxis: {
      title: "Amplitude",
      domain: [0.55, 1.0],
      range: [-1.5, 1.5],
      showgrid: true,
      gridcolor: "#e5e5e5",
    },
    yaxis2: {
      title: "Amplitude",
      domain: [0.0, 0.45],
      range: [-1.5, 1.5],
      showgrid: true,
      gridcolor: "#e5e5e5",
    },

    annotations: [
      {
        xref: "paper",
        yref: "paper",
        x: 0.5,
        y: 1.05,
        xanchor: "center",
        yanchor: "bottom",
        text: `<b>Original Signal (${fm} Hz) and Sampling Points</b>`,
        showarrow: false,
        font: { size: 14 },
      },
      {
        xref: "paper",
        yref: "paper",
        x: 0.5,
        y: 0.48,
        xanchor: "center",
        yanchor: "bottom",
        text: `<b>Reconstructed Signal (Apparent Freq: ${f_alias} Hz)</b>`,
        showarrow: false,
        font: { size: 14 },
      },
    ],
    plot_bgcolor: "#ffffff",
    paper_bgcolor: "transparent",
  };

  Plotly.react(
    "plot",
    [
      trace_original,
      trace_samples,
      trace_recon_original,
      trace_reconstructed,
      trace_recon_samples,
    ],
    layout,
    { responsive: true, displayModeBar: false },
  );
}

updatePlot();

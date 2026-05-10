// Time Setup: 0 to 0.05 seconds at 100,000 Hz sampling frequency
const fs = 100000;
const duration = 0.05;
const NUM_POINTS = Math.floor(duration * fs) + 1; // 5001 points
const t = new Float32Array(NUM_POINTS);

for (let i = 0; i < NUM_POINTS; i++) {
  t[i] = i / fs;
}

// UI Toggler: Displays the correct Modulation Index slider based on selection
function handleModTypeChange() {
  const modType = document.getElementById("mod_type").value;
  document.getElementById("group_am_idx").style.display =
    modType === "AM" ? "block" : "none";
  document.getElementById("group_fm_idx").style.display =
    modType === "FM" ? "block" : "none";
  document.getElementById("group_pm_idx").style.display =
    modType === "PM" ? "block" : "none";
}

// Helper to fetch numeric values from DOM
const getVal = (id) => parseFloat(document.getElementById(id).value);

function updatePlot() {
  const mod_type = document.getElementById("mod_type").value;
  const Am = getVal("Am_slider");
  const Ac = getVal("Ac_slider");
  const Fm = getVal("Fm_slider");
  const Fc = getVal("Fc_slider");
  const Pm = getVal("Pm_slider");
  const Pc = getVal("Pc_slider");

  // Modulation Indices
  const mu = getVal("mu_slider");
  const beta = getVal("beta_slider");
  const kp = getVal("kp_slider");

  // Arrays to hold our waveform data
  const m = new Float32Array(NUM_POINTS);
  const c = new Float32Array(NUM_POINTS);
  const s = new Float32Array(NUM_POINTS);

  let max_s = 0;

  for (let i = 0; i < NUM_POINTS; i++) {
    const time = t[i];

    // Base Signals
    m[i] = Am * Math.cos(2 * Math.PI * Fm * time + Pm);
    c[i] = Ac * Math.cos(2 * Math.PI * Fc * time + Pc);

    // Modulated Signal Processing
    if (mod_type === "AM") {
      s[i] = Ac * (1 + mu * m[i]) * Math.cos(2 * Math.PI * Fc * time + Pc);
    } else if (mod_type === "FM") {
      // Using standard normalized FM representation for single-tone visualization:
      s[i] =
        Ac *
        Math.cos(
          2 * Math.PI * Fc * time +
            Pc +
            beta * Math.sin(2 * Math.PI * Fm * time + Pm),
        );
    } else if (mod_type === "PM") {
      s[i] = Ac * Math.cos(2 * Math.PI * Fc * time + Pc + kp * m[i]);
    }

    // Track max amplitude dynamically
    if (Math.abs(s[i]) > max_s) max_s = Math.abs(s[i]);
  }

  // 3 Traces anchored to separate X and Y axes
  const trace1 = {
    x: t,
    y: m,
    type: "scatter",
    mode: "lines",
    line: { color: "#0056b3", width: 2 },
    xaxis: "x",
    yaxis: "y",
  };
  const trace2 = {
    x: t,
    y: c,
    type: "scatter",
    mode: "lines",
    line: { color: "#d9534f", width: 1.5 },
    xaxis: "x2",
    yaxis: "y2",
  };
  const trace3 = {
    x: t,
    y: s,
    type: "scatter",
    mode: "lines",
    line: { color: "#2ca02c", width: 1.5 },
    xaxis: "x3",
    yaxis: "y3",
  };

  // Layout defined by specific screen domains to enforce gaps
  const layout = {
    margin: { l: 60, r: 20, t: 60, b: 50 },
    showlegend: false,

    // Shared but strictly anchored X-axes
    xaxis: {
      anchor: "y",
      showgrid: true,
      gridcolor: "#e5e5e5",
      range: [0, 0.05],
    },
    xaxis2: {
      anchor: "y2",
      showgrid: true,
      gridcolor: "#e5e5e5",
      range: [0, 0.05],
    },
    xaxis3: {
      anchor: "y3",
      showgrid: true,
      gridcolor: "#e5e5e5",
      title: "Time (s)",
      range: [0, 0.05],
    },

    // Y-axes constrained to segments (Leaves a 12.5% gap above and below the center plot)
    yaxis: {
      title: "m(t)",
      domain: [0.75, 1.0],
      range: [-Am * 1.2, Am * 1.2],
      showgrid: true,
      gridcolor: "#e5e5e5",
    },
    yaxis2: {
      title: "c(t)",
      domain: [0.375, 0.625],
      range: [-Ac * 1.2, Ac * 1.2],
      showgrid: true,
      gridcolor: "#e5e5e5",
    },
    yaxis3: {
      title: "s(t)",
      domain: [0.0, 0.25],
      range: [-max_s * 1.1 - 0.1, max_s * 1.1 + 0.1],
      showgrid: true,
      gridcolor: "#e5e5e5",
    },

    annotations: [
      {
        xref: "paper",
        yref: "paper",
        x: 0.5,
        y: 1.07,
        xanchor: "center",
        yanchor: "bottom",
        text: "<b>Message Signal m(t)</b>",
        showarrow: false,
        font: { size: 14 },
      },
      {
        xref: "paper",
        yref: "paper",
        x: 0.5,
        y: 0.65,
        xanchor: "center",
        yanchor: "bottom",
        text: "<b>Carrier Signal c(t)</b>",
        showarrow: false,
        font: { size: 14 },
      },
      {
        xref: "paper",
        yref: "paper",
        x: 0.5,
        y: 0.28,
        xanchor: "center",
        yanchor: "bottom",
        text: `<b>${mod_type} Modulated Signal s(t)</b>`,
        showarrow: false,
        font: { size: 14 },
      },
    ],
    plot_bgcolor: "#ffffff",
    paper_bgcolor: "transparent",
  };

  Plotly.react("plot", [trace1, trace2, trace3], layout, {
    responsive: true,
    displayModeBar: false,
  });
}

// Initialize UI layout and initial plot rendering
handleModTypeChange();
updatePlot();

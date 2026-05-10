// Force the input box to only accept 1s and 0s
function validateBinary(input) {
  input.value = input.value.replace(/[^01]/g, "");
}

const getVal = (id) => parseFloat(document.getElementById(id).value);

function updatePlot() {
  const mod_type = document.getElementById("mod_type").value;
  let binStr = document.getElementById("binary_input").value;

  // Fallback if user deletes everything
  if (binStr === "") binStr = "0";

  const bits = binStr.split("").map(Number);
  const Ac = getVal("Ac_slider");
  const Fc = getVal("Fc_slider");
  const Tb = getVal("Tb_slider");

  // Calculate time vectors based on bit length
  const ptsPerBit = 500;
  const totalPts = bits.length * ptsPerBit;
  const t = new Float32Array(totalPts);

  const m = new Float32Array(totalPts);
  const c = new Float32Array(totalPts);
  const s = new Float32Array(totalPts);

  const totalTime = bits.length * Tb;

  for (let i = 0; i < totalPts; i++) {
    const time = (i / ptsPerBit) * Tb;
    t[i] = time;

    const bitIndex = Math.min(Math.floor(time / Tb), bits.length - 1);
    const bit = bits[bitIndex];

    // 1. Digital Message (Square wave)
    m[i] = bit;

    // 2. Continuous Carrier
    c[i] = Ac * Math.cos(2 * Math.PI * Fc * time);

    // 3. Digital Modulation Logic
    if (mod_type === "ASK") {
      // Carrier is ON for 1, OFF for 0
      s[i] = bit === 1 ? c[i] : 0;
    } else if (mod_type === "FSK") {
      // F1 for 1, F0 for 0 (shifting the frequency)
      const f_shift = bit === 1 ? Fc + 2 : Fc - 1;
      s[i] = Ac * Math.cos(2 * Math.PI * f_shift * time);
    } else if (mod_type === "BPSK") {
      // Phase shift of 180 degrees (Pi radians) when bit is 0
      const phase = bit === 1 ? 0 : Math.PI;
      s[i] = Ac * Math.cos(2 * Math.PI * Fc * time + phase);
    }
  }

  // Define Plotly Traces. Note: shape: 'vh' makes the message wave a perfect square step function!
  const trace1 = {
    x: t,
    y: m,
    type: "scatter",
    mode: "lines",
    line: { color: "#0056b3", width: 2, shape: "vh" },
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

  // Generate vertical dashed lines to show bit boundaries
  const bitBoundaries = [];
  for (let i = 1; i < bits.length; i++) {
    bitBoundaries.push({
      type: "line",
      x0: i * Tb,
      y0: 0,
      x1: i * Tb,
      y1: 1,
      yref: "paper",
      line: { color: "grey", width: 1, dash: "dash" },
    });
  }

  const layout = {
    margin: { l: 60, r: 20, t: 60, b: 50 },
    showlegend: false,
    shapes: bitBoundaries, // Inject the vertical lines

    xaxis: { anchor: "y", showgrid: false, range: [0, totalTime] },
    xaxis2: { anchor: "y2", showgrid: false, range: [0, totalTime] },
    xaxis3: {
      anchor: "y3",
      showgrid: false,
      title: "Time (s)",
      range: [0, totalTime],
    },

    yaxis: {
      title: "Data m(t)",
      domain: [0.75, 1.0],
      range: [-0.2, 1.2],
      showgrid: true,
      gridcolor: "#e5e5e5",
    },
    yaxis2: {
      title: "Carrier c(t)",
      domain: [0.375, 0.625],
      range: [-Ac * 1.2, Ac * 1.2],
      showgrid: true,
      gridcolor: "#e5e5e5",
    },
    yaxis3: {
      title: "Modulated s(t)",
      domain: [0.0, 0.25],
      range: [-Ac * 1.2, Ac * 1.2],
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
        text: "<b>Binary Message Signal</b>",
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
        text: "<b>Unmodulated Carrier</b>",
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
        text: `<b>${mod_type} Signal</b>`,
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

// Initial plot rendering
updatePlot();

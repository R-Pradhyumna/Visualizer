# Communications Engineering Suite

A high-performance, purely client-side web application suite designed to help engineering students visualize core analog and digital communication techniques in real-time.

## Live Demo

[Insert Your GitHub Pages Link Here]

---

## Overview

This suite provides an interactive, mathematically rigorous environment for exploring signal processing. By leveraging hardware-accelerated charting and high-speed array processing in vanilla JavaScript, the simulators render thousands of data points at 60 frames per second without requiring a backend server or local environment setup.

---

## Included Modules

### 1. Analog Modulation

Visualizes continuous wave modulation techniques using a composite multi-tone message signal.

#### Techniques

- Amplitude Modulation (AM)
- Frequency Modulation (FM)
- Phase Modulation (PM)

#### Features

- Independent control over dual message tones (amplitude and frequency)
- Carrier parameter adjustment
- Dynamic modulation index controls

---

### 2. Digital Modulation

Visualizes discrete binary data transmission by mapping logic states to analog carrier variations.

#### Techniques

- Amplitude Shift Keying (ASK)
- Frequency Shift Keying (FSK)
- Binary Phase Shift Keying (BPSK)

#### Features

- Custom binary string input
- Adjustable bit duration
- Vertical bit-boundary markers for precise state transition tracking

---

### 3. Sampling Theorem & Nyquist

Demonstrates analog-to-digital conversion using the Nyquist-Shannon sampling theorem.

#### Features

- Interactive sampling frequency adjustment
- Real-time signal reconstruction
- Dynamic state warnings:
  - Over-sampled
  - Critical
  - Aliasing

---

## Mathematical Foundation

The simulators compute time-domain waveforms based on foundational communication theory.

For a composite message signal `m(t)` and a carrier signal:

```math
c(t) = A_c \cos(2\pi f_c t + \phi_c)
```

The modulated outputs are calculated as follows:

### Amplitude Modulation (AM)

```math
s(t) = A_c [1 + \mu m(t)] \cos(2\pi f_c t + \phi_c)
```

### Frequency Modulation (FM)

```math
s(t) = A_c \cos(2\pi f_c t + \phi_c + 2\pi \beta \int m(\tau)d\tau)
```

### Phase Modulation (PM)

```math
s(t) = A_c \cos(2\pi f_c t + \phi_c + k_p m(t))
```

> **Note:**  
> The FM module utilizes a discrete running integral for real-time calculation of complex composite signals, avoiding static calculus derivatives.

---

## Educational Disclaimer

To ensure visual clarity and pedagogical value, the parameters in the Digital Modulation and Sampling modules are intentionally scaled down from real-world applications.

For example, a simulated BPSK carrier frequency is constrained to `1–10 Hz` with a `1-second` bit duration, allowing students to visually count individual cycles.

In practical communication systems (e.g., IEEE 802.11 standards), frequencies operate in the Gigahertz (GHz) range with nanosecond-scale bit durations.

---

## Technical Architecture

### Frontend

- HTML5
- CSS3

### Logic

- Vanilla JavaScript (ES6+)
- `Float32Array` for high-speed digital signal processing

### Rendering

- Plotly.js for responsive, WebGL-accelerated interactive plotting

### Accessibility

- Fully WCAG compliant
- Semantic HTML structure
- ARIA labels
- Keyboard navigability
- Live region announcements for screen readers

---

## Repository Structure

```text
communications-suite/
│
├── index.html          # Master landing page
├── style.css           # Global stylesheet
│
├── analog/             # Analog Modulation Module
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── digital/            # Digital Modulation Module
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── sampling/           # Nyquist Sampling Module
│   ├── index.html
│   ├── script.js
│   └── style.css
```

---

## How to Run Locally

This suite requires zero dependencies, build tools, or package managers.

1. Clone this repository or download the ZIP file.
2. Open the root `index.html` file in any modern web browser:
3. Use the main menu to navigate between the different visualizers.

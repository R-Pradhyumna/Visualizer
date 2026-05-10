# Contributing to the Communications Engineering Suite

First off, thank you for considering contributing! This suite is built to help engineering students visualize complex mathematical concepts, and community contributions make that educational goal stronger.

## How to Contribute

### 1. Find or Open an Issue

Before writing any code, please check the [Issues](../../issues) tab to see if someone is already working on the feature or bug. If not, open a new issue describing what you'd like to build or fix.

### 2. Local Development Setup

Because this suite is purely client-side (HTML/CSS/Vanilla JS) and relies on no build tools or package managers, setup is instant:

1. Fork the repository to your own GitHub account.
2. Clone your fork locally: `git clone https://github.com/YOUR-USERNAME/Visualiser.git`
3. Open the root `index.html` file in any modern web browser to view the suite.
4. Make your edits in the respective module folders (`/analog`, `/digital`, `/sampling`).

### 3. Development Guidelines

- **No Dependencies:** Please avoid adding external libraries or frameworks (like React or heavy NPM packages) unless absolutely necessary. We want to keep the suite lightweight and accessible.
- **Math Accuracy:** If adding a new modulation technique, please ensure the mathematical models and discrete integrations are accurate and documented via inline comments.
- **Accessibility:** Ensure any new sliders or inputs have proper `<label>` tags and `aria-labels` for screen readers.

### 4. Submit a Pull Request

1. Create a new branch for your feature: `git checkout -b feature/your-feature-name`
2. Commit your changes with clear, descriptive messages.
3. Push to your fork and submit a Pull Request against our `main` branch.

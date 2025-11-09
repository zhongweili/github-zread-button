# GitHub Zread Button

A browser extension that adds a "Zread" button to GitHub repository pages, providing quick access to Zread.ai documentation.

## Features

- **Instant Access**: One-click access to Zread.ai documentation
- **Native Integration**: Seamlessly matches GitHub's UI
- **Fast & Lightweight**: Minimal page impact
- **Privacy First**: No data collection, all processing local
- **Theme Support**: Works in light and dark modes
- **SPA Compatible**: Works with GitHub's client-side navigation

## Installation

### Development Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Load in your browser:
   - **Chrome**: Open `chrome://extensions`, enable "Developer mode", click "Load unpacked", select `.output/chrome-mv3`
   - **Firefox**: Open `about:debugging`, click "Load Temporary Add-on", select any file in `.output/firefox-mv2`

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
npm install
npm run dev
```

### Testing

```bash
npm test                 # Run all tests
npm test -- --coverage   # Run with coverage
npm run lint            # Lint code
npm run format          # Format code
```

### Building

```bash
npm run build           # Build for Chrome
npm run build:firefox   # Build for Firefox
npm run build:all       # Build for all browsers
```

## Project Structure

```
github-zread-button/
├── entrypoints/
│   ├── content.ts       # Main content script
│   └── content.css      # Button styling
├── utils/
│   ├── url-transformer.ts     # URL parsing & transformation
│   ├── github-detector.ts     # Page detection logic
│   ├── button-injector.ts     # Button creation & injection
│   └── navigation-handler.ts  # SPA navigation handling
├── tests/
│   ├── unit/           # Unit tests
│   └── integration/    # Integration tests
├── public/
│   └── icon/           # Extension icons
└── wxt.config.ts       # WXT configuration
```

## Architecture

This extension follows a modular architecture:

1. **URL Transformer**: Extracts repository information from GitHub URLs
2. **GitHub Detector**: Detects repository pages and finds navigation containers
3. **Button Injector**: Creates and injects the Zread button into the DOM
4. **Navigation Handler**: Monitors SPA navigation and re-injects the button
5. **Content Script**: Orchestrates all modules

See [specs/design.md](./specs/design.md) for detailed architecture.

## Usage

1. Navigate to any GitHub repository
2. Look for the "Zread" button in the repository navigation bar
3. Click to open the repository documentation on Zread.ai

## License

MIT License - see LICENSE file for details

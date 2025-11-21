# GitHub Zread Button - Browser Extension Specification

## Project Overview

### Project Name
**GitHub Zread Button**

### Description
A modern browser extension that adds a quick-access "Zread" button to GitHub repository pages, enabling users to instantly navigate to Zread.ai's AI-powered documentation and analysis for any repository.

### Technology Stack
- **Framework**: WXT (Next-gen Web Extension Framework)
- **Language**: TypeScript
- **Build Tool**: Vite (via WXT)
- **Target Browsers**: Chrome, Firefox, Edge, Safari
- **Manifest Version**: V3 (with V2 fallback support via WXT)

---

## 1. Goals and Objectives

### Primary Goals
1. Provide seamless, one-click access to Zread.ai documentation from any GitHub repository page
2. Integrate naturally with GitHub's native UI/UX
3. Support all major browsers with a single codebase
4. Maintain excellent performance with minimal overhead
5. Respect user privacy with local-only operation (no data collection)

### Success Criteria
- Button appears correctly on all GitHub repository pages
- Navigation to Zread.ai works reliably with correct repository URL transformation
- Extension loads and operates with <100ms impact on page load
- Compatible with GitHub's SPA navigation system
- Zero reported security or privacy issues

---

## 2. Reference Implementation Analysis

### Original DeepWiki Button Extension
The reference implementation (github-deepwiki-button) provides the following insights:

**Architecture:**
- Uses webextension-toolbox for build management
- Content script injection on GitHub pages
- MutationObserver pattern for SPA navigation handling
- Simple URL transformation: `github.com/owner/repo` → `deepwiki.com/owner/repo`

**Key Features:**
- Button injection into GitHub's pagehead-actions navigation
- Handles GitHub's dynamic SPA routing
- Uses GitHub's native button styling (BtnGroup, btn-sm classes)
- Icon + text button design

**Limitations to Improve:**
- Uses older build tooling (webextension-toolbox)
- Manual manifest management
- Limited to specific browser builds

---

## 3. Feature Requirements

### 3.1 Core Features

#### F1: Button Injection
**Description:** Inject a "Zread" button into GitHub repository pages

**Requirements:**
- Button must appear in the repository header navigation area (`ul.pagehead-actions`)
- Button should be positioned as the first item in the navigation list
- Must not duplicate if already exists
- Must follow GitHub's Primer design system styling

**Visual Design:**
```
┌─────────────────────────┐
│ [Icon] Zread            │
└─────────────────────────┘
```

**Technical Details:**
- Container class: `zread-container`
- Button classes: `btn-sm btn BtnGroup-item zread-button`
- Icon: Zread logo (16x16px at standard DPI)
- Text: "Zread"
- Link behavior: Open in new tab with `noopener noreferrer`

#### F2: URL Transformation
**Description:** Convert GitHub repository URLs to Zread.ai URLs

**Requirements:**
- Extract owner and repository name from current URL
- Transform: `https://github.com/<owner>/<repo>` → `https://zread.ai/<owner>/<repo>`
- Handle edge cases:
  - Repository URLs with trailing slashes
  - URLs with additional path segments (e.g., `/issues`, `/pull/123`)
  - Private repositories (future consideration)

**URL Pattern Matching:**
```regex
^\/([^/]+)\/([^/]+)
```

#### F3: GitHub SPA Navigation Handling
**Description:** Maintain button presence during GitHub's client-side navigation

**Requirements:**
- Monitor URL changes without page reload
- Re-inject button when navigating between repositories
- Debounce button injection to avoid duplicate operations
- Use efficient DOM observation patterns

**Implementation Strategy:**
- Primary: URL change detection via MutationObserver
- Secondary: Monitor for navigation container changes
- Debounce delay: 500ms
- Processing flag to prevent concurrent injections

#### F4: Multi-Browser Support
**Description:** Support Chrome, Firefox, Edge, and Safari from single codebase

**Requirements:**
- Leverage WXT's automatic browser-specific builds
- Handle browser-specific API differences via WXT abstractions
- Minimum browser versions:
  - Chrome: 88+
  - Firefox: 102+
  - Edge: 88+
  - Safari: 14+ (if feasible)

### 3.2 Extended Features (Future Enhancements)

#### F5: Private Repository Support
**Description:** Enable Zread access for private repositories (when supported by Zread.ai)

**Requirements:**
- Detect private repository indicators
- Show appropriate UI state or message
- Handle authentication flow if/when Zread.ai supports it

#### F6: Settings/Options Page
**Description:** Allow users to configure extension behavior

**Potential Options:**
- Enable/disable button on specific organizations
- Button position preference
- Custom button text/styling
- Analytics opt-in (if ever needed)

#### F7: Context Menu Integration
**Description:** Add right-click context menu option

**Requirements:**
- "Open in Zread" context menu item
- Available when right-clicking repository name or page
- Same URL transformation logic

---

## 4. Technical Architecture

### 4.1 WXT Project Structure

```
github-zread-button/
├── .output/                    # Build artifacts (generated)
├── .wxt/                       # WXT generated config (generated)
├── entrypoints/
│   ├── content.ts             # Content script for GitHub pages
│   └── background.ts          # Background service worker (if needed)
├── assets/
│   └── styles/
│       └── content.css        # Button styling
├── public/
│   └── icon/
│       ├── icon-16.png
│       ├── icon-32.png
│       ├── icon-48.png
│       ├── icon-64.png
│       └── icon-128.png
├── components/                 # Reusable UI components (optional)
├── utils/
│   ├── url-transformer.ts     # URL transformation logic
│   └── github-detector.ts     # GitHub page detection utilities
├── wxt.config.ts              # WXT configuration
├── package.json
├── tsconfig.json
└── README.md
```

### 4.2 Entry Points

#### content.ts (Content Script)
**Purpose:** Inject button into GitHub pages

**Responsibilities:**
- Detect GitHub repository pages
- Inject Zread button into DOM
- Handle SPA navigation
- Apply styles

**Configuration:**
```typescript
// Defined in entrypoints/content.ts
export default defineContentScript({
  matches: ['https://github.com/*'],
  runAt: 'document_start',
  allFrames: false,
  cssInjectionMode: 'ui',
});
```

#### background.ts (Optional)
**Purpose:** Handle extension-wide logic if needed

**Potential Uses:**
- Analytics (if ever implemented)
- Settings management
- Badge updates

### 4.3 Core Logic Components

#### URL Transformer Module
**File:** `utils/url-transformer.ts`

**Functions:**
```typescript
/**
 * Extract repository owner and name from GitHub URL
 * @param url - Current window.location
 * @returns Object with owner and repo, or null if not a repo page
 */
export function extractRepoInfo(url: string): { owner: string; repo: string } | null;

/**
 * Generate Zread URL from repository info
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns Zread.ai URL
 */
export function generateZreadUrl(owner: string, repo: string): string;

/**
 * Check if current page is a repository page (main page only, not subpages)
 * @param pathname - window.location.pathname
 * @returns Boolean indicating if it's a repo main page
 */
export function isRepositoryPage(pathname: string): boolean;
```

#### Button Injector Module
**File:** `utils/button-injector.ts`

**Functions:**
```typescript
/**
 * Create and inject Zread button into GitHub navigation
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns Boolean indicating success
 */
export function injectZreadButton(owner: string, repo: string): boolean;

/**
 * Check if Zread button already exists
 * @returns Boolean indicating existence
 */
export function zreadButtonExists(): boolean;

/**
 * Remove existing Zread button (for cleanup)
 */
export function removeZreadButton(): void;
```

#### SPA Navigation Handler
**File:** `utils/navigation-handler.ts`

**Functions:**
```typescript
/**
 * Setup mutation observer for GitHub SPA navigation
 * @param callback - Function to call on navigation change
 */
export function setupNavigationObserver(callback: () => void): MutationObserver;

/**
 * Setup URL change detection
 * @param callback - Function to call on URL change
 */
export function setupUrlChangeDetection(callback: (newUrl: string) => void): void;
```

### 4.4 Styling Strategy

**Approach:** Minimal custom CSS, leverage GitHub's Primer design system

**Custom Styles:**
```css
/* Align button with GitHub's native styling */
.zread-button.btn-sm.btn.BtnGroup-item {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  padding: 3px 12px;
  gap: 8px;
}

.zread-button .octicon {
  display: inline-flex;
  align-items: center;
}

.zread-button .octicon img {
  display: block;
  vertical-align: text-bottom;
}

/* Hover state enhancement */
.zread-button:hover {
  opacity: 0.85;
}
```

---

## 5. Configuration and Settings

### 5.1 WXT Configuration
**File:** `wxt.config.ts`

```typescript
import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'GitHub Zread Button (Unofficial)',
    description: 'Add a quick access button to view GitHub repositories on Zread.ai',
    version: '1.0.0',
    permissions: ['scripting'],
    host_permissions: ['https://github.com/*'],
  },
  outDir: '.output',
  // Enable source maps for debugging
  sourcemap: true,
  // Optimize for production
  zip: {
    artifactTemplate: '{{name}}-{{version}}-{{browser}}.zip',
  },
});
```

### 5.2 Manifest Permissions

**Required Permissions:**
- `scripting`: For content script injection
- `host_permissions`: `https://github.com/*` - Access GitHub pages

**No Tracking/Analytics:**
- No storage permission
- No background permission (unless strictly needed)
- No web request modification

---

## 6. Development Workflow

### 6.1 Development Commands

```bash
# Install dependencies
npm install

# Start development mode (with HMR)
npm run dev            # Default browser (Chrome)
npm run dev:firefox    # Firefox
npm run dev:chrome     # Chrome explicitly

# Build for production
npm run build          # All browsers
npm run build:chrome   # Chrome only
npm run build:firefox  # Firefox only
npm run build:edge     # Edge only

# Create distribution packages
npm run zip            # Create .zip files for all browsers
npm run zip:chrome     # Chrome only

# Code quality
npm run type-check     # TypeScript checking
npm run lint           # ESLint
npm run format         # Prettier
```

### 6.2 Testing Strategy

**Manual Testing Checklist:**
- [ ] Button appears on repository home page
- [ ] Button appears after navigating to different repository
- [ ] Button links to correct Zread.ai URL
- [ ] Button doesn't duplicate on navigation
- [ ] Styling matches GitHub's design
- [ ] Works on private repositories (shows button)
- [ ] Handles special characters in repo names
- [ ] Works on organization repositories
- [ ] Button removed on non-repository pages

**Browser Testing:**
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Edge
- [ ] Safari (if supported)

**GitHub Page Types to Test:**
- `/owner/repo` - Main repository page (should show button)
- `/owner/repo?tab=readme` - Main repository page with query params (should show button)
- `/owner/repo#readme` - Main repository page with fragment (should show button)
- `/owner/repo/issues` - Issues page (should NOT show button)
- `/owner/repo/pull/123` - Pull request page (should NOT show button)
- `/owner/repo/tree/main` - Code browser (should NOT show button)
- `/owner/repo/blob/main/file.js` - File viewer (should NOT show button)
- `/owner` - Organization/user profile (should NOT show button)
- `/` - GitHub homepage (should NOT show button)

### 6.3 Debugging

**WXT Developer Tools:**
```typescript
// Enable verbose logging in development
if (import.meta.env.DEV) {
  console.log('[Zread] Button injected');
}
```

**Browser DevTools:**
- Use WXT's dev mode with HMR for rapid iteration
- Inspect content script in browser DevTools
- Monitor network requests (should be none from extension)
- Check console for errors

---

## 7. Security and Privacy

### 7.1 Security Considerations

**Content Security Policy:**
- No inline scripts or styles
- No remote code execution
- No eval() or similar dynamic code

**XSS Prevention:**
- Use textContent for text insertion
- Sanitize any user input (none expected)
- createElement for DOM manipulation (no innerHTML)

**Permissions Minimization:**
- Only request necessary permissions
- No broad host permissions
- No access to user data

### 7.2 Privacy Guarantees

**Data Collection:**
- ZERO data collection
- No analytics
- No telemetry
- No external API calls from extension

**Local-Only Operation:**
- All processing happens client-side
- No data leaves user's browser
- No storage of user information

**Transparency:**
- Open source code
- Clear permission explanations
- Privacy policy stating no data collection

---

## 8. Build and Distribution

### 8.1 Build Process

**WXT Build Pipeline:**
1. TypeScript compilation
2. Asset optimization (images, styles)
3. Browser-specific manifest generation
4. Code bundling and minification
5. Source map generation (dev only)
6. Zip file creation for distribution

**Output Structure:**
```
.output/
├── chrome-mv3/          # Chrome extension
├── firefox-mv2/         # Firefox extension
├── edge-mv3/            # Edge extension
└── safari-mv3/          # Safari extension (if supported)
```

### 8.2 Browser Store Distribution

**Chrome Web Store:**
- Platform: Chrome, Edge, Brave, Opera
- Package: `.output/chrome-mv3.zip`
- Review time: ~1-3 days

**Firefox Add-ons:**
- Platform: Firefox
- Package: `.output/firefox-mv2.zip`
- Review time: ~1-7 days

**Edge Add-ons:**
- Platform: Microsoft Edge
- Package: `.output/edge-mv3.zip`
- Review time: ~1-3 days

**Safari Extensions (Future):**
- Requires additional Xcode packaging
- WXT experimental support

### 8.3 CI/CD Pipeline

**GitHub Actions Workflow:**
```yaml
# .github/workflows/build.yml
name: Build Extension

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run build
      - run: npm run zip
      - uses: actions/upload-artifact@v4
        with:
          name: extensions
          path: .output/*.zip
```

---

## 9. Internationalization (i18n)

### 9.1 Supported Languages (Initial)
- English (en) - Default
- Chinese Simplified (zh-CN) - Primary target for Zread users

### 9.2 Message Structure

**WXT i18n Support:**
```typescript
// entrypoints/content.ts
import { browser } from 'wxt/browser';

const buttonText = browser.i18n.getMessage('buttonLabel');
```

**Messages File:**
```json
// public/_locales/en/messages.json
{
  "extensionName": {
    "message": "GitHub Zread Button (Unofficial)"
  },
  "extensionDescription": {
    "message": "Add a quick access button to view GitHub repositories on Zread.ai"
  },
  "buttonLabel": {
    "message": "Zread"
  }
}

// public/_locales/zh_CN/messages.json
{
  "extensionName": {
    "message": "GitHub Zread 按钮（非官方）"
  },
  "extensionDescription": {
    "message": "添加快速访问按钮，在 Zread.ai 上查看 GitHub 仓库"
  },
  "buttonLabel": {
    "message": "Zread"
  }
}
```

---

## 10. Performance Requirements

### 10.1 Performance Targets

**Load Time:**
- Extension initialization: <50ms
- Button injection: <100ms
- Total impact on GitHub page load: <100ms

**Memory Usage:**
- Idle: <5MB
- Active: <10MB

**CPU Usage:**
- Background: Negligible
- During injection: <100ms of CPU time

### 10.2 Optimization Strategies

**Code Splitting:**
- Minimal content script size
- Lazy load non-critical features

**DOM Operations:**
- Batch DOM reads and writes
- Use DocumentFragment for complex insertions
- Minimize reflows and repaints

**Event Handling:**
- Debounce mutation observer callbacks
- Use passive event listeners where possible
- Clean up observers when not needed

---

## 11. Error Handling

### 11.1 Error Scenarios

**Scenario 1: Navigation Element Not Found**
```typescript
if (!navActions) {
  console.warn('[Zread] Navigation element not found, retrying...');
  return false;
}
```

**Scenario 2: Invalid Repository URL**
```typescript
const repoInfo = extractRepoInfo(window.location.href);
if (!repoInfo) {
  console.debug('[Zread] Not a repository page, skipping');
  return;
}
```

**Scenario 3: Button Injection Failure**
```typescript
try {
  injectZreadButton(owner, repo);
} catch (error) {
  console.error('[Zread] Failed to inject button:', error);
  // Retry after delay or fail silently
}
```

### 11.2 Logging Strategy

**Development:**
- Verbose console logging
- Stack traces for errors
- Performance timing logs

**Production:**
- Error logging only
- No user data in logs
- Graceful degradation

---

## 12. Maintenance and Updates

### 12.1 Version Strategy

**Semantic Versioning:**
- Major: Breaking changes or major feature additions
- Minor: New features, backward compatible
- Patch: Bug fixes and small improvements

**Example:**
- `1.0.0` - Initial release
- `1.1.0` - Add settings page
- `1.1.1` - Fix button positioning bug

### 12.2 GitHub DOM Changes

**Monitoring Strategy:**
- Track GitHub's UI updates
- Test extension after GitHub releases
- Have fallback detection for navigation elements

**Selector Resilience:**
- Use multiple selector strategies
- Prefer data attributes over classes where stable
- Document selector dependencies

### 12.3 Zread.ai API Changes

**Considerations:**
- URL format changes
- New features (private repos, etc.)
- API endpoints (if ever needed)

---

## 13. Success Metrics

### 13.1 Technical Metrics
- Extension load time: <100ms
- Button injection success rate: >99%
- Crash rate: <0.1%
- Browser compatibility: 100% on target browsers

### 13.2 User Metrics (if tracking implemented)
- Click-through rate to Zread.ai
- Active users
- User retention

### 13.3 Quality Metrics
- Test coverage: >80%
- Zero critical security issues
- <1% error rate in production

---

## 14. Dependencies

### 14.1 Runtime Dependencies
```json
{
  "dependencies": {}
}
```
*Note: WXT provides browser APIs through wxt/browser, no runtime dependencies needed*

### 14.2 Development Dependencies
```json
{
  "devDependencies": {
    "wxt": "^0.19.0",
    "typescript": "^5.0.0",
    "@types/chrome": "^0.0.268",
    "vite": "^5.0.0"
  }
}
```

### 14.3 Browser APIs Used
- `chrome.runtime.getURL()` - For accessing extension resources
- Content Script API - For DOM injection
- Optional: Storage API (for future settings)

---

## 15. Risks and Mitigations

### 15.1 Risk Assessment

**Risk 1: GitHub UI Changes**
- **Probability:** Medium
- **Impact:** High
- **Mitigation:** Resilient selectors, monitoring, automated tests

**Risk 2: Zread.ai URL Format Changes**
- **Probability:** Low
- **Impact:** High
- **Mitigation:** Modular URL transformation, easy updates

**Risk 3: Browser API Changes**
- **Probability:** Low
- **Impact:** Medium
- **Mitigation:** WXT handles browser differences, stays updated

**Risk 4: Performance Impact**
- **Probability:** Low
- **Impact:** Medium
- **Mitigation:** Performance monitoring, optimization, lazy loading

**Risk 5: Browser Store Rejection**
- **Probability:** Low
- **Impact:** High
- **Mitigation:** Follow all store guidelines, clear privacy policy

---

## 16. Future Enhancements

### Phase 2 Features
1. **Settings Page:**
   - Customize button appearance
   - Enable/disable on specific orgs
   - Keyboard shortcuts

2. **Context Menu Integration:**
   - Right-click to open in Zread
   - Quick access from anywhere

3. **Enhanced UI:**
   - Tooltip showing Zread benefits
   - Loading indicator while generating docs
   - Error states for unavailable repos

4. **Private Repository Support:**
   - Authentication flow
   - Token management
   - Secure storage

### Phase 3 Features
1. **Browser Action Popup:**
   - Recent repositories
   - Quick links
   - Extension stats

2. **Advanced Analytics (Opt-in):**
   - Usage patterns
   - Performance metrics
   - User feedback

3. **Integration with GitHub Features:**
   - Pull request comments
   - Issue templates
   - Actions integration

---

## 17. Documentation Deliverables

### 17.1 User Documentation
- README.md with installation instructions
- Screenshots and demo GIF
- FAQ section
- Troubleshooting guide

### 17.2 Developer Documentation
- CONTRIBUTING.md
- Architecture overview
- API documentation
- Development setup guide

### 17.3 Store Listings
- Chrome Web Store description
- Firefox Add-ons description
- Screenshots (1280x800px)
- Promotional images

---

## 18. Acceptance Criteria

### Minimum Viable Product (MVP)
- [ ] Button appears on GitHub repository pages
- [ ] Button links to correct Zread.ai URL
- [ ] Works across Chrome, Firefox, and Edge
- [ ] Handles GitHub SPA navigation
- [ ] Matches GitHub's UI styling
- [ ] No performance impact (<100ms)
- [ ] Zero data collection
- [ ] Passes browser store review

### Definition of Done
- [ ] All features implemented and tested
- [ ] Documentation complete
- [ ] Code reviewed and approved
- [ ] No critical or high-priority bugs
- [ ] Published to browser stores
- [ ] README and user guide published
- [ ] Source code open-sourced (if planned)

---

## 19. Timeline Estimate

### Development Phases
1. **Phase 1: Setup & Core (Week 1)**
   - WXT project initialization
   - Basic button injection
   - URL transformation
   - Initial testing

2. **Phase 2: Polish & Testing (Week 2)**
   - SPA navigation handling
   - Styling refinement
   - Cross-browser testing
   - Performance optimization

3. **Phase 3: Release Preparation (Week 3)**
   - Documentation
   - Store assets preparation
   - Final testing
   - Submission to stores

4. **Phase 4: Post-Release (Ongoing)**
   - Monitor for issues
   - User feedback integration
   - Maintenance updates

---

## 20. References and Resources

### Documentation
- WXT Framework: https://wxt.dev/
- Chrome Extensions: https://developer.chrome.com/docs/extensions/
- Firefox Extensions: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions
- GitHub Primer: https://primer.style/

### Related Projects
- Reference Implementation: https://github.com/yamadashy/github-deepwiki-button
- Zread.ai: https://zread.ai/
- DeepWiki: https://deepwiki.com/

### Community
- WXT Discord: [Link if available]
- GitHub Discussions: [Repository discussions]

---

## Appendix A: Code Snippets

### A.1 Main Content Script Structure
```typescript
// entrypoints/content.ts
import { defineContentScript } from 'wxt/sandbox';
import { extractRepoInfo, generateZreadUrl } from '@/utils/url-transformer';
import { injectZreadButton, zreadButtonExists } from '@/utils/button-injector';
import { setupNavigationObserver } from '@/utils/navigation-handler';

export default defineContentScript({
  matches: ['https://github.com/*'],
  runAt: 'document_start',

  main() {
    // Initial injection
    injectButtonIfNeeded();

    // Handle navigation
    setupNavigationObserver(() => {
      injectButtonIfNeeded();
    });
  },
});

function injectButtonIfNeeded() {
  if (zreadButtonExists()) return;

  const repoInfo = extractRepoInfo(window.location.href);
  if (!repoInfo) return;

  injectZreadButton(repoInfo.owner, repoInfo.repo);
}
```

### A.2 URL Transformer Implementation
```typescript
// utils/url-transformer.ts
export interface RepoInfo {
  owner: string;
  repo: string;
}

export function extractRepoInfo(url: string): RepoInfo | null {
  const urlObj = new URL(url);
  const match = urlObj.pathname.match(/^\/([^/]+)\/([^/]+)/);

  if (!match) return null;

  const [, owner, repo] = match;

  // Remove .git suffix if present
  const cleanRepo = repo.replace(/\.git$/, '');

  return { owner, repo: cleanRepo };
}

export function generateZreadUrl(owner: string, repo: string): string {
  return `https://zread.ai/${owner}/${repo}`;
}

export function isRepositoryPage(pathname: string): boolean {
  // Remove query params and fragments
  const cleanPath = pathname.split(/[?#]/)[0];

  // Remove trailing slashes
  const normalizedPath = cleanPath.replace(/\/+$/, '');

  // Must have exactly /owner/repo format (no additional segments)
  const segments = normalizedPath.split('/').filter((s) => s.length > 0);
  return segments.length === 2;
}
```

---

## Appendix B: Design Assets Specifications

### B.1 Icon Specifications

**Sizes Required:**
- 16x16px - Browser toolbar
- 32x32px - Retina toolbar
- 48x48px - Extension management page
- 64x64px - Button icon
- 128x128px - Web store listing

**Design Guidelines:**
- Use Zread brand colors (if available)
- Simple, recognizable design
- Works on light and dark backgrounds
- PNG format with transparency
- Optimized file size

### B.2 Screenshot Specifications

**Chrome Web Store:**
- Size: 1280x800px or 640x400px
- Format: PNG or JPEG
- Quantity: 1-5 images
- Content: Show button in context on GitHub

**Firefox Add-ons:**
- Size: Any size up to 5MB
- Format: PNG or JPEG
- Quantity: 1-10 images

---

## Appendix C: Store Listing Copy

### Extension Name
**GitHub Zread Button (Unofficial)**

### Short Description (132 chars max)
Instantly access AI-powered documentation for any GitHub repository with Zread.ai - just one click away.

### Detailed Description

Enhance your GitHub browsing experience with quick access to Zread.ai, the AI-powered platform that transforms repositories into comprehensive, readable documentation.

**Features:**
✓ One-click access from any GitHub repository
✓ Seamlessly integrated button in GitHub's native UI
✓ Instant navigation to Zread.ai documentation
✓ Works with public and private repositories
✓ Zero data collection - complete privacy
✓ Lightweight and fast - no performance impact

**How to Use:**
1. Visit any GitHub repository
2. Look for the "Zread" button in the top navigation
3. Click to view AI-generated documentation on Zread.ai

**About Zread.ai:**
Zread transforms GitHub repositories into structured user manuals with:
- Project architecture visualization
- Module summaries and explanations
- Code logic breakdown
- Community insights
- AI-powered Q&A

**Privacy First:**
This extension operates entirely in your browser with no data collection, tracking, or external requests. Your browsing remains private.

**Open Source:**
This is an unofficial, community-built extension. Source code available at [GitHub URL].

**Support:**
For issues or feature requests, please visit our GitHub repository.

---

**End of Specification Document**

Version: 1.0.0
Last Updated: 2025-11-09
Author: Technical Specification Team
Status: Ready for Implementation

import { isRepositoryPage, extractRepoInfo, type RepoInfo } from './url-transformer';

/**
 * Page detection result
 */
export interface PageDetectionResult {
  isRepoPage: boolean;
  repoInfo: RepoInfo | null;
  hasNavigation: boolean;
}

/**
 * Check if current page is a repository page
 * @returns True if on a GitHub repository page
 */
export function isRepoPage(): boolean {
  return isRepositoryPage(window.location.pathname);
}

/**
 * Find GitHub navigation container element
 * @returns Navigation element or null if not found
 */
export function findNavigationContainer(): HTMLElement | null {
  // Try primary selector
  const primary = document.querySelector<HTMLElement>('ul.pagehead-actions');
  if (primary) return primary;

  // Fallback selectors for different GitHub UI versions
  const fallbacks = [
    'nav.UnderlineNav ul',
    '.reponav-wrapper ul',
    '.BorderGrid-row .d-flex ul',
  ];

  for (const selector of fallbacks) {
    const element = document.querySelector<HTMLElement>(selector);
    if (element) return element;
  }

  return null;
}

/**
 * Check if GitHub page is fully loaded and ready
 * @returns True if page is ready
 */
export function isPageReady(): boolean {
  return (
    (document.readyState === 'complete' ||
      document.readyState === 'interactive') &&
    findNavigationContainer() !== null
  );
}

/**
 * Comprehensive page detection
 * @returns Detection result with all relevant info
 */
export function detectPage(): PageDetectionResult {
  const isRepo = isRepoPage();
  const repoInfo = isRepo ? extractRepoInfo(window.location.pathname) : null;
  const hasNavigation = findNavigationContainer() !== null;

  return {
    isRepoPage: isRepo,
    repoInfo,
    hasNavigation,
  };
}

/**
 * Wait for navigation container to be available
 * @param timeout - Maximum wait time in ms (default: 5000)
 * @returns Promise resolving to element or null
 */
export function waitForNavigation(
  timeout = 5000
): Promise<HTMLElement | null> {
  return new Promise((resolve) => {
    // Check immediately
    const existing = findNavigationContainer();
    if (existing) {
      resolve(existing);
      return;
    }

    // Setup observer
    const observer = new MutationObserver(() => {
      const container = findNavigationContainer();
      if (container) {
        observer.disconnect();
        clearTimeout(timer);
        resolve(container);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Timeout fallback
    const timer = setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeout);
  });
}

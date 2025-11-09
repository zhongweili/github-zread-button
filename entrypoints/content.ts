import './styles.css';
import { detectPage, waitForNavigation } from '../utils/github-detector';
import {
  injectZreadButton,
  removeZreadButton,
  zreadButtonExists,
} from '../utils/button-injector';
import {
  setupNavigationObserver,
  cleanupObservers,
} from '../utils/navigation-handler';
import { logger } from '../utils/logger';

// WXT content script entry point
export default defineContentScript({
  matches: ['https://github.com/*/*'],
  main,
});

/**
 * Main entry point for the content script
 */
async function main() {
  logger.log('[Zread] Content script loaded');

  // Initial injection
  await injectButtonIfNeeded();

  // Setup navigation observer
  setupNavigationObserver(handleNavigation);

  // Cleanup on unload
  window.addEventListener('beforeunload', () => {
    cleanupObservers();
  });
}

/**
 * Inject button if conditions are met
 */
async function injectButtonIfNeeded(retryCount = 0): Promise<void> {
  const MAX_RETRIES = 3;
  const RETRY_DELAYS = [100, 500, 1000];

  try {
    // Detect page type
    const detection = detectPage();

    if (!detection.isRepoPage || !detection.repoInfo) {
      logger.debug('[Zread] Not a repository page, skipping');
      return;
    }

    // Wait for navigation container if needed
    if (!detection.hasNavigation) {
      logger.debug('[Zread] Waiting for navigation container...');
      const container = await waitForNavigation(5000);
      if (!container) {
        throw new Error('Navigation container not found after timeout');
      }
    }

    // Skip if button already exists
    if (zreadButtonExists()) {
      logger.debug('[Zread] Button already exists');
      return;
    }

    // Inject button
    const { owner, repo } = detection.repoInfo;
    const success = injectZreadButton(owner, repo);

    if (!success) {
      throw new Error('Button injection failed');
    }

    logger.log('[Zread] Button injected for', `${owner}/${repo}`);
  } catch (error) {
    logger.error('[Zread] Injection error:', error);

    if (retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAYS[retryCount];
      logger.debug(
        `[Zread] Retrying in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`
      );
      setTimeout(() => injectButtonIfNeeded(retryCount + 1), delay);
    }
  }
}

/**
 * Handle navigation events
 */
async function handleNavigation(url: string): Promise<void> {
  logger.debug('[Zread] Handling navigation to:', url);

  // Remove existing button
  removeZreadButton();

  // Re-inject if needed
  await injectButtonIfNeeded();
}

// Types for WXT
function defineContentScript(config: {
  matches: string[];
  main: () => void | Promise<void>;
}) {
  return config;
}

import { logger } from './logger';

/**
 * Navigation callback function type
 */
export type NavigationCallback = (url: string) => void | Promise<void>;

/**
 * Cleanup function type
 */
export type CleanupFunction = () => void;

// Module-level state
let currentUrl = window.location.href;
let isProcessing = false;
let debounceTimer: number | null = null;
let mutationObserver: MutationObserver | null = null;

const DEBOUNCE_DELAY = 500; // ms

/**
 * Setup URL change detection
 * @param callback - Function to call on URL change
 * @returns Cleanup function
 */
export function setupUrlChangeDetection(
  callback: NavigationCallback
): CleanupFunction {
  // Store initial URL
  currentUrl = window.location.href;

  const checkUrlChange = () => {
    const newUrl = window.location.href;

    if (newUrl !== currentUrl) {
      logger.debug('[Zread] URL changed:', currentUrl, '->', newUrl);
      currentUrl = newUrl;

      // Debounce callback
      if (debounceTimer !== null) {
        clearTimeout(debounceTimer);
      }

      debounceTimer = window.setTimeout(async () => {
        if (!isProcessing) {
          isProcessing = true;
          try {
            await callback(newUrl);
          } catch (error) {
            // Log error but don't throw to prevent unhandled rejection
            logger.error('[Zread] Navigation callback error:', error);
          } finally {
            isProcessing = false;
          }
        }
      }, DEBOUNCE_DELAY);
    }
  };

  // Check periodically (fallback)
  const intervalId = setInterval(checkUrlChange, 1000);

  return () => {
    clearInterval(intervalId);
    if (debounceTimer !== null) {
      clearTimeout(debounceTimer);
    }
  };
}

/**
 * Setup mutation observer for navigation changes
 * @param callback - Function to call on navigation
 * @returns MutationObserver instance
 */
export function setupNavigationObserver(
  callback: NavigationCallback
): MutationObserver {
  // Cleanup existing observer first to prevent leaks
  if (mutationObserver) {
    mutationObserver.disconnect();
    mutationObserver = null;
  }

  // Create observer
  const observer = new MutationObserver(() => {
    // Check if URL changed
    const newUrl = window.location.href;

    if (newUrl !== currentUrl) {
      logger.debug('[Zread] Navigation detected:', newUrl);
      currentUrl = newUrl;

      // Debounce callback
      if (debounceTimer !== null) {
        clearTimeout(debounceTimer);
      }

      debounceTimer = window.setTimeout(async () => {
        if (!isProcessing) {
          isProcessing = true;
          try {
            await callback(newUrl);
          } catch (error) {
            // Log error but don't throw to prevent unhandled rejection
            logger.error('[Zread] Navigation callback error:', error);
          } finally {
            isProcessing = false;
          }
        }
      }, DEBOUNCE_DELAY);
    }
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  mutationObserver = observer;

  return observer;
}

/**
 * Cleanup all observers and event listeners
 */
export function cleanupObservers(): void {
  if (mutationObserver) {
    mutationObserver.disconnect();
    mutationObserver = null;
  }

  if (debounceTimer !== null) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }

  isProcessing = false;

  logger.debug('[Zread] Observers cleaned up');
}

/**
 * Check if currently processing navigation
 * @returns True if processing
 */
export function isProcessingNavigation(): boolean {
  return isProcessing;
}

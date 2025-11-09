import { generateZreadUrl } from './url-transformer';
import { findNavigationContainer } from './github-detector';
import { logger } from './logger';

const ZREAD_CONTAINER_CLASS = 'zread-container';
const ZREAD_BUTTON_CLASS = 'zread-button';
const ZREAD_BUTTON_SELECTOR = `.${ZREAD_CONTAINER_CLASS}`;

/**
 * Sanitize input to prevent XSS and other security issues
 * @param input - String to sanitize
 * @returns Sanitized string
 */
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>'"]/g, '')
    .trim()
    .slice(0, 100);
}

/**
 * Check if Zread button currently exists in DOM
 * @returns True if button exists
 */
export function zreadButtonExists(): boolean {
  return document.querySelector(ZREAD_BUTTON_SELECTOR) !== null;
}

/**
 * Create button element without injecting
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns HTMLElement ready for injection
 */
export function createButtonElement(owner: string, repo: string): HTMLElement {
  // Sanitize inputs to prevent XSS
  const safeOwner = sanitizeInput(owner);
  const safeRepo = sanitizeInput(repo);

  // Create container (li element)
  const container = document.createElement('li');
  container.className = ZREAD_CONTAINER_CLASS;

  // Create BtnGroup container (following GitHub's UI pattern)
  const btnGroup = document.createElement('div');
  btnGroup.setAttribute('data-view-component', 'true');
  btnGroup.className = 'BtnGroup';

  // Create button (a element)
  const link = document.createElement('a');
  link.href = generateZreadUrl(safeOwner, safeRepo);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.className = `btn-sm btn BtnGroup-item ${ZREAD_BUTTON_CLASS}`;
  link.setAttribute('data-view-component', 'true');

  // Create icon span
  const iconSpan = document.createElement('span');
  iconSpan.className = 'octicon';

  // Create icon image
  const iconImg = document.createElement('img');
  iconImg.src = chrome.runtime.getURL('icon/icon-16.png');
  iconImg.width = 16;
  iconImg.height = 16;
  iconImg.alt = 'Zread';
  iconSpan.appendChild(iconImg);

  // Create text node
  const textNode = document.createTextNode('Zread');

  // Assemble: icon + text -> button -> btnGroup -> container
  link.appendChild(iconSpan);
  link.appendChild(textNode);
  btnGroup.appendChild(link);
  container.appendChild(btnGroup);

  return container;
}

/**
 * Inject Zread button into GitHub navigation
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns True if injection successful
 */
export function injectZreadButton(owner: string, repo: string): boolean {
  try {
    // Check if button already exists
    if (zreadButtonExists()) {
      logger.debug('[Zread] Button already exists, skipping injection');
      return false;
    }

    // Find navigation container
    const navContainer = findNavigationContainer();
    if (!navContainer) {
      logger.warn('[Zread] Navigation container not found');
      return false;
    }

    // Create button
    const button = createButtonElement(owner, repo);

    // Insert as first child
    navContainer.insertBefore(button, navContainer.firstChild);

    logger.debug('[Zread] Button injected successfully');
    return true;
  } catch (error) {
    logger.error('[Zread] Button injection failed:', error);
    return false;
  }
}

/**
 * Remove Zread button from DOM
 * Idempotent - safe to call even if button doesn't exist
 */
export function removeZreadButton(): void {
  const button = document.querySelector(ZREAD_BUTTON_SELECTOR);
  if (button) {
    button.remove();
    logger.debug('[Zread] Button removed');
  }
}

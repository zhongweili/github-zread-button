import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  isRepoPage,
  findNavigationContainer,
  isPageReady,
  detectPage,
} from '../../utils/github-detector';

describe('GitHub Detector', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { pathname: '/' },
      writable: true,
      configurable: true,
    });
  });

  describe('findNavigationContainer', () => {
    it('should find ul.pagehead-actions', () => {
      document.body.innerHTML = '<ul class="pagehead-actions"></ul>';
      const result = findNavigationContainer();
      expect(result).not.toBeNull();
      expect(result?.tagName).toBe('UL');
      expect(result?.classList.contains('pagehead-actions')).toBe(true);
    });

    it('should return null when not found', () => {
      const result = findNavigationContainer();
      expect(result).toBeNull();
    });

    it('should find fallback selectors', () => {
      document.body.innerHTML = '<nav class="UnderlineNav"><ul></ul></nav>';
      const result = findNavigationContainer();
      expect(result).not.toBeNull();
      expect(result?.tagName).toBe('UL');
    });
  });

  describe('isPageReady', () => {
    it('should return true when ready and nav exists', () => {
      document.body.innerHTML = '<ul class="pagehead-actions"></ul>';
      Object.defineProperty(document, 'readyState', {
        value: 'complete',
        writable: true,
        configurable: true,
      });
      expect(isPageReady()).toBe(true);
    });

    it('should return false when nav does not exist', () => {
      Object.defineProperty(document, 'readyState', {
        value: 'complete',
        writable: true,
        configurable: true,
      });
      expect(isPageReady()).toBe(false);
    });
  });

  describe('isRepoPage', () => {
    it('should return true for repository pages', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/facebook/react' },
        writable: true,
        configurable: true,
      });
      expect(isRepoPage()).toBe(true);
    });

    it('should return false for non-repository pages', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/explore' },
        writable: true,
        configurable: true,
      });
      expect(isRepoPage()).toBe(false);
    });
  });

  describe('detectPage', () => {
    it('should detect repository page', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/facebook/react' },
        writable: true,
        configurable: true,
      });
      document.body.innerHTML = '<ul class="pagehead-actions"></ul>';

      const result = detectPage();
      expect(result.isRepoPage).toBe(true);
      expect(result.repoInfo).toEqual({ owner: 'facebook', repo: 'react' });
      expect(result.hasNavigation).toBe(true);
    });

    it('should detect non-repository page', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/explore' },
        writable: true,
        configurable: true,
      });

      const result = detectPage();
      expect(result.isRepoPage).toBe(false);
      expect(result.repoInfo).toBeNull();
      expect(result.hasNavigation).toBe(false);
    });
  });
});

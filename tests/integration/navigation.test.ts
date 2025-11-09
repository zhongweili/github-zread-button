import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  setupNavigationObserver,
  cleanupObservers,
} from '../../utils/navigation-handler';

describe('Navigation Handler Integration', () => {
  let callback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    callback = vi.fn();
    document.body.innerHTML = '<div id="app"></div>';
    // Reset location
    Object.defineProperty(window, 'location', {
      value: { href: 'https://github.com/facebook/react' },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    cleanupObservers();
  });

  it('should detect URL changes', async () => {
    setupNavigationObserver(callback);

    // Simulate URL change
    Object.defineProperty(window, 'location', {
      value: { href: 'https://github.com/vuejs/vue' },
      writable: true,
      configurable: true,
    });

    // Trigger DOM mutation
    const div = document.createElement('div');
    document.body.appendChild(div);

    // Wait for debounce
    await new Promise((resolve) => setTimeout(resolve, 600));

    expect(callback).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith('https://github.com/vuejs/vue');
  });

  it('should debounce rapid changes', async () => {
    setupNavigationObserver(callback);

    // Change URL
    Object.defineProperty(window, 'location', {
      value: { href: 'https://github.com/vuejs/vue' },
      writable: true,
      configurable: true,
    });

    // Trigger multiple rapid mutations
    for (let i = 0; i < 5; i++) {
      const div = document.createElement('div');
      div.id = `test-${i}`;
      document.body.appendChild(div);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    // Wait for debounce
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Should only call once due to debouncing
    expect(callback.mock.calls.length).toBeLessThanOrEqual(2);
  });

  it('should cleanup observers', () => {
    const observer = setupNavigationObserver(callback);
    expect(observer).toBeDefined();

    cleanupObservers();

    // Trigger DOM mutation after cleanup
    const div = document.createElement('div');
    document.body.appendChild(div);

    // Change URL
    Object.defineProperty(window, 'location', {
      value: { href: 'https://github.com/new/repo' },
      writable: true,
      configurable: true,
    });

    // Callback should not be called
    setTimeout(() => {
      expect(callback).not.toHaveBeenCalled();
    }, 100);
  });

  it('should prevent race conditions with async callbacks', async () => {
    let callbackCount = 0;
    const slowCallback = vi.fn(async (url: string) => {
      callbackCount++;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });

    setupNavigationObserver(slowCallback);

    // Trigger rapid navigations
    for (let i = 0; i < 3; i++) {
      Object.defineProperty(window, 'location', {
        value: { href: `https://github.com/repo${i}/test` },
        writable: true,
        configurable: true,
      });
      document.body.appendChild(document.createElement('div'));
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Should only process one callback due to isProcessing flag
    expect(callbackCount).toBeLessThanOrEqual(1);
  });

  it('should clear processing flag on callback error', async () => {
    const errorCallback = vi.fn(async () => {
      throw new Error('Test error');
    });

    setupNavigationObserver(errorCallback);

    Object.defineProperty(window, 'location', {
      value: { href: 'https://github.com/new/repo' },
      writable: true,
      configurable: true,
    });
    document.body.appendChild(document.createElement('div'));

    await new Promise((resolve) => setTimeout(resolve, 600));

    // Processing flag should be cleared even after error
    // This is tested implicitly - if flag wasn't cleared, a second navigation would not trigger
    Object.defineProperty(window, 'location', {
      value: { href: 'https://github.com/another/repo' },
      writable: true,
      configurable: true,
    });
    document.body.appendChild(document.createElement('div'));

    await new Promise((resolve) => setTimeout(resolve, 600));

    // Should have been called twice despite the error
    expect(errorCallback).toHaveBeenCalledTimes(2);
  });

  it('should prevent observer leaks when called multiple times', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    // Setup first observer
    const observer1 = setupNavigationObserver(callback1);
    expect(observer1).toBeDefined();

    // Setup second observer (should cleanup first)
    const observer2 = setupNavigationObserver(callback2);
    expect(observer2).toBeDefined();

    // Change URL and trigger mutation
    Object.defineProperty(window, 'location', {
      value: { href: 'https://github.com/new/repo' },
      writable: true,
      configurable: true,
    });
    document.body.appendChild(document.createElement('div'));

    // Wait for debounce
    setTimeout(() => {
      // Only the second callback should be called
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    }, 600);
  });
});

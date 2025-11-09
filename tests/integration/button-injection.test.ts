import { describe, it, expect, beforeEach } from 'vitest';
import {
  injectZreadButton,
  zreadButtonExists,
  removeZreadButton,
} from '../../utils/button-injector';

describe('Button Injection Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<ul class="pagehead-actions"></ul>';
  });

  it('should inject button successfully', () => {
    const result = injectZreadButton('facebook', 'react');
    expect(result).toBe(true);
    expect(zreadButtonExists()).toBe(true);
  });

  it('should not inject duplicate buttons', () => {
    injectZreadButton('facebook', 'react');
    const result = injectZreadButton('facebook', 'react');
    expect(result).toBe(false);

    const buttons = document.querySelectorAll('.zread-container');
    expect(buttons.length).toBe(1);
  });

  it('should remove button successfully', () => {
    injectZreadButton('facebook', 'react');
    expect(zreadButtonExists()).toBe(true);

    removeZreadButton();
    expect(zreadButtonExists()).toBe(false);
  });

  it('should generate correct Zread URL', () => {
    injectZreadButton('facebook', 'react');
    const link = document.querySelector<HTMLAnchorElement>('.zread-button');
    expect(link?.href).toBe('https://zread.ai/facebook/react');
  });

  it('should have correct button structure', () => {
    injectZreadButton('facebook', 'react');

    const container = document.querySelector('.zread-container');
    expect(container?.tagName).toBe('LI');

    const link = container?.querySelector('a');
    expect(link?.target).toBe('_blank');
    expect(link?.rel).toBe('noopener noreferrer');

    const icon = link?.querySelector('.octicon img');
    expect(icon).not.toBeNull();
  });

  it('should return false when navigation container not found', () => {
    document.body.innerHTML = '';
    const result = injectZreadButton('facebook', 'react');
    expect(result).toBe(false);
  });
});

import { describe, it, expect } from 'vitest';
import {
  extractRepoInfo,
  generateZreadUrl,
  isRepositoryPage,
} from '../../utils/url-transformer';

describe('extractRepoInfo', () => {
  it('should extract owner and repo from valid URL', () => {
    const result = extractRepoInfo('https://github.com/facebook/react');
    expect(result).toEqual({ owner: 'facebook', repo: 'react' });
  });

  it('should extract from pathname', () => {
    const result = extractRepoInfo('/facebook/react');
    expect(result).toEqual({ owner: 'facebook', repo: 'react' });
  });

  it('should extract from nested paths', () => {
    const result = extractRepoInfo('/facebook/react/issues/123');
    expect(result).toEqual({ owner: 'facebook', repo: 'react' });
  });

  it('should return null for invalid URLs', () => {
    expect(extractRepoInfo('/facebook')).toBeNull();
    expect(extractRepoInfo('/')).toBeNull();
    expect(extractRepoInfo('')).toBeNull();
  });

  it('should handle query parameters', () => {
    const result = extractRepoInfo('/facebook/react?tab=readme');
    expect(result).toEqual({ owner: 'facebook', repo: 'react' });
  });

  it('should handle URL fragments', () => {
    const result = extractRepoInfo('/facebook/react#readme');
    expect(result).toEqual({ owner: 'facebook', repo: 'react' });
  });

  it('should handle special characters in repo names', () => {
    const result = extractRepoInfo('/owner/repo-with-dashes');
    expect(result).toEqual({ owner: 'owner', repo: 'repo-with-dashes' });
  });

  it('should handle very long repo names', () => {
    const longName = 'a'.repeat(100);
    const result = extractRepoInfo(`/owner/${longName}`);
    expect(result?.repo).toBe(longName);
  });
});

describe('generateZreadUrl', () => {
  it('should generate correct Zread URL', () => {
    const url = generateZreadUrl('facebook', 'react');
    expect(url).toBe('https://zread.ai/facebook/react');
  });

  it('should encode special characters', () => {
    const url = generateZreadUrl('user@name', 'repo name');
    expect(url).toContain(encodeURIComponent('user@name'));
    expect(url).toContain(encodeURIComponent('repo name'));
  });

  it('should handle slash in owner name', () => {
    const url = generateZreadUrl('owner/test', 'repo');
    expect(url).toBe(
      `https://zread.ai/${encodeURIComponent('owner/test')}/repo`
    );
  });
});

describe('isRepositoryPage', () => {
  it('should return true for repository main pages', () => {
    expect(isRepositoryPage('/facebook/react')).toBe(true);
    expect(isRepositoryPage('/owner/repo')).toBe(true);
    expect(isRepositoryPage('/facebook/react/')).toBe(true);
  });

  it('should return true for main pages with query params or fragments', () => {
    expect(isRepositoryPage('/facebook/react?tab=readme')).toBe(true);
    expect(isRepositoryPage('/facebook/react#readme')).toBe(true);
  });

  it('should return false for repository subpages', () => {
    expect(isRepositoryPage('/owner/repo/issues')).toBe(false);
    expect(isRepositoryPage('/owner/repo/pull/123')).toBe(false);
    expect(isRepositoryPage('/owner/repo/tree/main')).toBe(false);
    expect(isRepositoryPage('/a/b/c/d/e')).toBe(false);
  });

  it('should return false for non-repository pages', () => {
    expect(isRepositoryPage('/')).toBe(false);
    expect(isRepositoryPage('/facebook')).toBe(false);
    expect(isRepositoryPage('/explore')).toBe(false);
  });
});

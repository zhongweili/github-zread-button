import { describe, it, expect } from 'vitest';
import { extractRepoInfo, generateZreadUrl } from '../../utils/url-transformer';
import { findNavigationContainer } from '../../utils/github-detector';

describe('Edge Cases', () => {
  describe('URL Handling', () => {
    it('should handle special characters in repo names', () => {
      const info = extractRepoInfo('/owner/repo-with-dashes');
      expect(info).toEqual({ owner: 'owner', repo: 'repo-with-dashes' });
    });

    it('should handle underscores in names', () => {
      const info = extractRepoInfo('/owner_name/repo_name');
      expect(info).toEqual({ owner: 'owner_name', repo: 'repo_name' });
    });

    it('should handle dots in repo names', () => {
      const info = extractRepoInfo('/owner/repo.js');
      expect(info).toEqual({ owner: 'owner', repo: 'repo.js' });
    });

    it('should handle very long repo names', () => {
      const longName = 'a'.repeat(100);
      const info = extractRepoInfo(`/owner/${longName}`);
      expect(info?.repo).toBe(longName);
    });

    it('should handle URL fragments', () => {
      const info = extractRepoInfo('/owner/repo#readme');
      expect(info).toEqual({ owner: 'owner', repo: 'repo' });
    });

    it('should handle complex query parameters', () => {
      const info = extractRepoInfo('/owner/repo?tab=readme&filter=all#top');
      expect(info).toEqual({ owner: 'owner', repo: 'repo' });
    });

    it('should handle numeric repo names', () => {
      const info = extractRepoInfo('/owner/123');
      expect(info).toEqual({ owner: 'owner', repo: '123' });
    });

    it('should handle mixed case names', () => {
      const info = extractRepoInfo('/OwnerName/RepoName');
      expect(info).toEqual({ owner: 'OwnerName', repo: 'RepoName' });
    });
  });

  describe('URL Generation', () => {
    it('should encode special characters in owner', () => {
      const url = generateZreadUrl('owner@test', 'repo');
      expect(url).toBe(
        `https://zread.ai/${encodeURIComponent('owner@test')}/repo`
      );
    });

    it('should encode spaces', () => {
      const url = generateZreadUrl('owner name', 'repo name');
      expect(url).toContain(encodeURIComponent('owner name'));
      expect(url).toContain(encodeURIComponent('repo name'));
    });

    it('should encode forward slashes', () => {
      const url = generateZreadUrl('owner/test', 'repo');
      expect(url).toBe(
        `https://zread.ai/${encodeURIComponent('owner/test')}/repo`
      );
    });
  });

  describe('DOM Handling', () => {
    it('should gracefully handle missing DOM elements', () => {
      document.body.innerHTML = '';
      expect(() => findNavigationContainer()).not.toThrow();
      expect(findNavigationContainer()).toBeNull();
    });

    it('should handle empty document body', () => {
      document.body.innerHTML = '';
      const result = findNavigationContainer();
      expect(result).toBeNull();
    });

    it('should handle malformed DOM structure', () => {
      document.body.innerHTML = '<div><span></span></div>';
      const result = findNavigationContainer();
      expect(result).toBeNull();
    });
  });

  describe('Error Resilience', () => {
    it('should handle null inputs gracefully', () => {
      expect(() => extractRepoInfo('')).not.toThrow();
      expect(extractRepoInfo('')).toBeNull();
    });

    it('should handle malformed URLs', () => {
      expect(() => extractRepoInfo('not-a-url')).not.toThrow();
    });

    it('should handle URLs with only owner', () => {
      expect(extractRepoInfo('/owner')).toBeNull();
    });

    it('should handle root path', () => {
      expect(extractRepoInfo('/')).toBeNull();
    });

    it('should handle empty path segments', () => {
      expect(extractRepoInfo('//')).toBeNull();
    });
  });

  describe('Reserved Paths', () => {
    it('should reject /settings as repository', () => {
      expect(extractRepoInfo('/settings/something')).toBeNull();
    });

    it('should reject /marketplace as repository', () => {
      expect(extractRepoInfo('/marketplace/actions')).toBeNull();
    });

    it('should reject /codespaces as repository', () => {
      expect(extractRepoInfo('/codespaces/new')).toBeNull();
    });

    it('should reject /explore as repository', () => {
      expect(extractRepoInfo('/explore')).toBeNull();
    });

    it('should reject /topics as repository', () => {
      expect(extractRepoInfo('/topics/javascript')).toBeNull();
    });

    it('should reject /collections as repository', () => {
      expect(extractRepoInfo('/collections/popular')).toBeNull();
    });

    it('should reject /sponsors as repository', () => {
      expect(extractRepoInfo('/sponsors/someone')).toBeNull();
    });

    it('should reject /notifications as repository', () => {
      expect(extractRepoInfo('/notifications')).toBeNull();
    });

    it('should reject /watching as repository', () => {
      expect(extractRepoInfo('/watching')).toBeNull();
    });

    it('should reject /stars as repository', () => {
      expect(extractRepoInfo('/stars')).toBeNull();
    });

    it('should reject /issues as repository', () => {
      expect(extractRepoInfo('/issues')).toBeNull();
    });

    it('should reject /pulls as repository', () => {
      expect(extractRepoInfo('/pulls')).toBeNull();
    });

    it('should reject /orgs as repository', () => {
      expect(extractRepoInfo('/orgs/myorg')).toBeNull();
    });

    it('should reject /security as repository', () => {
      expect(extractRepoInfo('/security/advisories')).toBeNull();
    });

    it('should reject /features as repository', () => {
      expect(extractRepoInfo('/features/actions')).toBeNull();
    });

    it('should reject /pricing as repository', () => {
      expect(extractRepoInfo('/pricing')).toBeNull();
    });

    it('should reject /about as repository', () => {
      expect(extractRepoInfo('/about')).toBeNull();
    });

    it('should reject /enterprise as repository', () => {
      expect(extractRepoInfo('/enterprise')).toBeNull();
    });

    it('should reject /team as repository', () => {
      expect(extractRepoInfo('/team')).toBeNull();
    });

    it('should handle case-insensitive reserved paths', () => {
      expect(extractRepoInfo('/SETTINGS/something')).toBeNull();
      expect(extractRepoInfo('/Marketplace/actions')).toBeNull();
      expect(extractRepoInfo('/Notifications')).toBeNull();
    });

    it('should accept valid owner names similar to reserved paths', () => {
      // These should be valid as they are not exact matches
      const info = extractRepoInfo('/settings-org/repo');
      expect(info).toEqual({ owner: 'settings-org', repo: 'repo' });

      const info2 = extractRepoInfo('/my-marketplace/repo');
      expect(info2).toEqual({ owner: 'my-marketplace', repo: 'repo' });
    });
  });
});

import { logger } from './logger';

/**
 * Repository information extracted from URL
 */
export interface RepoInfo {
  owner: string;
  repo: string;
}

/**
 * GitHub reserved paths that should not be treated as repository owners
 */
const GITHUB_RESERVED_PATHS = new Set([
  'settings',
  'marketplace',
  'codespaces',
  'explore',
  'topics',
  'collections',
  'sponsors',
  'customer-stories',
  'security',
  'features',
  'team',
  'enterprise',
  'about',
  'pricing',
  'nonprofit',
  'education',
  'solutions',
  'resources',
  'orgs',
  'notifications',
  'watching',
  'stars',
  'issues',
  'pulls',
]);

/**
 * Extract repository owner and name from GitHub URL
 * @param url - Full URL or pathname
 * @returns Repository info or null if invalid
 */
export function extractRepoInfo(url: string): RepoInfo | null {
  try {
    // Handle both full URLs and pathnames
    const pathname = url.startsWith('http')
      ? new URL(url).pathname
      : url;

    // Pattern: /owner/repo[/...]
    const match = pathname.match(/^\/([^/]+)\/([^/]+)/);

    if (!match) return null;

    const [, owner, repo] = match;

    // Validate owner is not a reserved path
    if (GITHUB_RESERVED_PATHS.has(owner.toLowerCase())) {
      return null;
    }

    // Clean repo name (remove .git, query params, fragments)
    const cleanRepo = repo.split(/[?#]/)[0];

    return {
      owner: owner.trim(),
      repo: cleanRepo.trim(),
    };
  } catch (error) {
    logger.error('[Zread] URL extraction error:', error);
    return null;
  }
}

/**
 * Generate Zread.ai URL from repository information
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns Full Zread.ai URL
 */
export function generateZreadUrl(owner: string, repo: string): string {
  return `https://zread.ai/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
}

/**
 * Check if pathname represents a repository page
 * @param pathname - URL pathname
 * @returns True if repository page (main page only, not subpages)
 */
export function isRepositoryPage(pathname: string): boolean {
  // Remove query params and fragments
  const cleanPath = pathname.split(/[?#]/)[0];

  // Remove trailing slashes
  const normalizedPath = cleanPath.replace(/\/+$/, '');

  // Must have exactly /owner/repo format (no additional segments)
  const segments = normalizedPath.split('/').filter((s) => s.length > 0);
  return segments.length === 2;
}

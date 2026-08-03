// Utility for building asset URLs that work both on GitHub Pages and in dev.
// In production (GitHub Pages), assets are served from /<repo>/
// In development, they're served from /

export function assetUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  if (typeof window !== 'undefined') {
    const isGitHubPages = window.location.hostname.includes('github.io')
    if (isGitHubPages) {
      return `/chongoyape-bizcochuelos-lab${p}`
    }
  }
  return p
}

// Utility for building asset URLs that respect the Next.js basePath.
// In production (GitHub Pages), assets are served from /<repo>/...
// In development, basePath is empty so paths are root-relative.

export function assetUrl(path: string): string {
  // Ensure path starts with /
  const p = path.startsWith('/') ? path : `/${path}`
  // In production, basePath is set in next.config.ts
  // We use process.env.NODE_ENV as a proxy; the actual basePath is configured at build time
  if (process.env.NODE_ENV === 'production') {
    return `/chongoyape-bizcochuelos-lab${p}`
  }
  return p
}

// Utility for building asset URLs that work with Next.js basePath.
// In production (GitHub Pages), Next.js automatically prefixes asset URLs
// when basePath is set in next.config.ts. For images in <img> tags,
// we need to manually prepend the basePath.
//
// This file is the SINGLE source of truth for basePath-aware URLs.
// Do NOT use window.location.hostname checks elsewhere.

const REPO_NAME = 'chongoyape-bizcochuelos-lab'

export function assetUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  // In production, Next.js sets basePath but <img src> doesn't auto-prefix
  if (process.env.NODE_ENV === 'production') {
    return `/${REPO_NAME}${p}`
  }
  return p
}

// For fetch() calls — in production, the JSON is served at /<repo>/lab-data.json
// In dev, it's at /lab-data.json
export function dataUrl(): string {
  if (process.env.NODE_ENV === 'production') {
    return `/${REPO_NAME}/lab-data.json`
  }
  return '/lab-data.json'
}

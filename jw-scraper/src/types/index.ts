export const APPROVED_DOMAINS = [
  'jw.org',
  'wol.jw.org',
  'tv.jw.org',
  'www.jw.org',
  'download.jw.org',
] as const

export function isApprovedSource(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.replace('www.', '')
    return APPROVED_DOMAINS.some(domain =>
      hostname === domain || hostname.endsWith('.' + domain)
    )
  } catch {
    return false
  }
}

export interface SearchResult {
  title: string
  url: string
  snippet: string
  type: 'article' | 'video' | 'song'
  source: 'jw.org' | 'wol.jw.org'
  thumbnail?: string
  publication?: string
  date?: string
}

export interface SearchQuery {
  q: string
  type?: 'article' | 'video' | 'song' | 'all'
  limit?: number
}

export interface ScraperResponse {
  success: boolean
  results: SearchResult[]
  total: number
  query: string
  error?: string
}

const SCRAPER_URL = import.meta.env.VITE_SCRAPER_URL || 'http://localhost:3001'

const APPROVED_DOMAINS = [
  'jw.org',
  'wol.jw.org',
  'tv.jw.org',
  'www.jw.org',
  'download.jw.org',
]

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

export async function searchJWMaterial(
  query: string,
  type: 'article' | 'video' | 'song' | 'all' = 'all',
  limit = 10
): Promise<SearchResult[]> {
  const params = new URLSearchParams({ q: query, type, limit: String(limit) })
  const res = await fetch(`${SCRAPER_URL}/search?${params}`)
  if (!res.ok) throw new Error('Scraper request failed')
  const data = await res.json()
  return (data.results as SearchResult[]).filter(r => isApprovedSource(r.url))
}

export interface TopicResult {
  title: string
  url: string
  snippet: string
  source?: string
}

export async function fetchTopicsFromURL(url: string): Promise<TopicResult[]> {
  if (!isApprovedSource(url)) {
    throw new Error('Only JW.org sources are permitted')
  }
  const params = new URLSearchParams({ url })
  const res = await fetch(`${SCRAPER_URL}/topics?${params}`)
  if (!res.ok) throw new Error('Failed to fetch topics')
  const data = await res.json()
  return data.topics as TopicResult[]
}

export async function fetchArticleContent(url: string): Promise<{
  title: string
  content: string
  paragraphs: string[]
}> {
  if (!isApprovedSource(url)) {
    throw new Error('Only links from JW.org are permitted as study materials')
  }
  const params = new URLSearchParams({ url })
  const res = await fetch(`${SCRAPER_URL}/search/article?${params}`)
  if (!res.ok) throw new Error('Failed to fetch article')
  return res.json()
}

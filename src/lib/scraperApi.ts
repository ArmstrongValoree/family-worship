const SCRAPER_URL = import.meta.env.VITE_SCRAPER_URL || 'http://localhost:3001'

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
  return data.results as SearchResult[]
}

export async function fetchArticleContent(url: string): Promise<{
  title: string
  content: string
  paragraphs: string[]
}> {
  const params = new URLSearchParams({ url })
  const res = await fetch(`${SCRAPER_URL}/search/article?${params}`)
  if (!res.ok) throw new Error('Failed to fetch article')
  return res.json()
}

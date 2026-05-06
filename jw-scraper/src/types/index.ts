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

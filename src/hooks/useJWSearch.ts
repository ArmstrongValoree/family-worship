import { useState, useCallback } from 'react'
import { searchJWMaterial, type SearchResult } from '../lib/scraperApi'

type SearchType = 'all' | 'article' | 'video' | 'song'

interface UseJWSearchReturn {
  query: string
  setQuery: (q: string) => void
  type: SearchType
  setType: (t: SearchType) => void
  results: SearchResult[]
  loading: boolean
  error: string | null
  search: () => Promise<void>
}

export function useJWSearch(): UseJWSearchReturn {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<SearchType>('all')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async () => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    try {
      const data = await searchJWMaterial(query.trim(), type)
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [query, type])

  return { query, setQuery, type, setType, results, loading, error, search }
}

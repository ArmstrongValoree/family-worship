import { useState, useEffect } from 'react'
import { X, Search, Loader2, CheckCircle, BookOpen } from 'lucide-react'
import { searchJWMaterial, fetchTopicsFromURL } from '../../lib/scraperApi'
import type { TopicResult } from '../../lib/scraperApi'
import type { Topic } from '../../types'

const WOL_URLS = [
  'https://wol.jw.org/en/wol/d/r1/lp-e/1204362',
  'https://wol.jw.org/en/wol/d/r1/lp-e/1102021613',
]

const FALLBACK_CATEGORIES = [
  'Prayer and Worship',
  'Bible Study',
  'Faith and Trust in Jehovah',
  'Family Life',
  'Preaching and Teaching',
  'Christian Qualities',
  'Endurance Through Trials',
  "Jehovah's Promises",
  'The Kingdom of God',
  'Moral Cleanness',
  'Love for Neighbors',
  'Youth and Teenagers',
  'Marriage and Singleness',
  'Death and the Resurrection',
  "Jehovah's Organization",
]

// Detects scripture reference patterns like "Eph. 6:17" or "1 Cor. 13:4"
function isScriptureRef(text: string): boolean {
  return /[A-Z][a-z]*\.\s*\d+:\d+/.test(text)
}

interface TopicAddModalProps {
  householdId: string
  onAdd: (topic: Omit<Topic, 'id' | 'created_at'>) => Promise<void>
  onClose: () => void
}

export function TopicAddModal({ householdId, onAdd, onClose }: TopicAddModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [results, setResults] = useState<TopicResult[]>([])
  const [searching, setSearching] = useState(false)
  const [savingUrl, setSavingUrl] = useState<string | null>(null)
  const [successTitle, setSuccessTitle] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>(FALLBACK_CATEGORIES)

  useEffect(() => {
    let mounted = true
    Promise.all(
      WOL_URLS.map(url => fetchTopicsFromURL(url).catch(() => [] as TopicResult[]))
    ).then(results => {
      if (!mounted) return
      const titles = results.flat().map(r => r.title).filter(t => t.length > 3)
      if (titles.length > 0) setCategories(titles.slice(0, 30))
    })
    return () => { mounted = false }
  }, [])

  function dedupeByUrl(items: TopicResult[]): TopicResult[] {
    return items.filter((item, index, self) =>
      index === self.findIndex(r => r.url === item.url)
    )
  }

  async function handleSearch() {
    if (!searchQuery.trim()) return
    setSearching(true)
    setResults([])
    try {
      const items = await searchJWMaterial(searchQuery.trim(), 'all', 8)
      setResults(dedupeByUrl(items.map(r => ({ title: r.title, url: r.url, snippet: r.snippet, source: r.source }))))
    } catch {
      setResults([])
    } finally {
      setSearching(false)
    }
  }

  async function handleCategorySelect(category: string) {
    setSelectedCategory(category)
    if (!category) return
    setSearching(true)
    setResults([])
    try {
      const items = await searchJWMaterial(category, 'all', 8)
      setResults(dedupeByUrl(items.map(r => ({ title: r.title, url: r.url, snippet: r.snippet, source: r.source }))))
    } catch {
      setResults([])
    } finally {
      setSearching(false)
    }
  }

  async function handleAddTopic(result: TopicResult) {
    const isRef = isScriptureRef(result.title)
    const titleToSave = isRef && result.snippet ? result.snippet : result.title
    const descriptionToSave = !isRef ? (result.snippet || undefined) : undefined

    setSavingUrl(result.url)
    try {
      await onAdd({
        household_id: householdId,
        title: titleToSave,
        description: descriptionToSave,
        source_url: result.url || undefined,
      })
      setSuccessTitle(titleToSave)
      setTimeout(() => setSuccessTitle(null), 3000)
    } finally {
      setSavingUrl(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-paradise-green-deep/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg backdrop-blur-lg bg-paradise-green-deep/90 border border-white/20 rounded-3xl p-6 z-10 max-h-[90vh] overflow-y-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-paradise-cream">Search for a Topic</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-paradise-cream/50 hover:text-paradise-cream hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Success toast */}
        {successTitle && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-paradise-green-light/10 border border-paradise-green-light/30">
            <CheckCircle size={15} className="text-paradise-green-light shrink-0" />
            <p className="text-paradise-green-light text-sm truncate">
              "{successTitle}" added to your library ✓
            </p>
          </div>
        )}

        {/* Search options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Text search */}
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. prayer, faith, endurance…"
              className="flex-1 min-w-0 bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-paradise-cream placeholder:text-white/40 focus:outline-none focus:border-paradise-gold transition-colors text-sm"
            />
            <button
              onClick={handleSearch}
              disabled={searching || !searchQuery.trim()}
              className="bg-paradise-gold text-paradise-green-deep font-semibold rounded-xl px-3 py-2.5 hover:bg-paradise-gold-light transition-colors disabled:opacity-50 flex items-center gap-1 text-sm shrink-0"
            >
              {searching && !selectedCategory
                ? <Loader2 size={15} className="animate-spin" />
                : <Search size={15} />
              }
            </button>
          </div>

          {/* Category dropdown */}
          <select
            value={selectedCategory}
            onChange={e => handleCategorySelect(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-paradise-cream focus:outline-none focus:border-paradise-gold transition-colors appearance-none text-sm"
          >
            <option value="" className="bg-paradise-green-deep text-paradise-cream/50">
              Browse by category…
            </option>
            {categories.map(cat => (
              <option key={cat} value={cat} className="bg-paradise-green-deep text-paradise-cream">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Results */}
        {searching ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={28} className="text-paradise-gold animate-spin" />
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-2">
            {results.map((result, i) => {
              const isRef = isScriptureRef(result.title)
              const primaryTitle = isRef && result.snippet ? result.snippet : result.title
              const secondaryText = isRef ? result.title : null
              const descriptionText = !isRef ? result.snippet : null
              return (
                <button
                  key={i}
                  onClick={() => handleAddTopic(result)}
                  disabled={savingUrl === result.url}
                  className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-paradise-gold/30 rounded-2xl p-4 transition-colors group disabled:opacity-60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-display text-paradise-cream text-base leading-snug">{primaryTitle}</p>
                        {result.source && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-paradise-cream/50 border border-white/10 shrink-0">
                            {result.source}
                          </span>
                        )}
                      </div>
                      {secondaryText && (
                        <p className="text-paradise-cream/40 text-[10px] mb-1">{secondaryText}</p>
                      )}
                      {descriptionText && (
                        <p className="text-paradise-cream/50 text-xs line-clamp-2">{descriptionText}</p>
                      )}
                    </div>
                    <div className="shrink-0 text-paradise-gold/40 group-hover:text-paradise-gold transition-colors text-xs font-semibold mt-0.5">
                      {savingUrl === result.url
                        ? <Loader2 size={14} className="animate-spin text-paradise-gold" />
                        : '+ Add'
                      }
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-8 text-paradise-cream/30">
            <BookOpen size={28} />
            <p className="text-sm">Search or browse a category above</p>
          </div>
        )}

        {/* Footer */}
        <div className="pt-1 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full border border-paradise-cream/20 text-paradise-cream/70 rounded-xl py-2.5 hover:border-paradise-cream/40 transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

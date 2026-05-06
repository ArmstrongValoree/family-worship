import { Search, Loader2 } from 'lucide-react'

type SearchType = 'all' | 'article' | 'video' | 'song'

interface SearchBarProps {
  query: string
  onQueryChange: (q: string) => void
  type: SearchType
  onTypeChange: (t: SearchType) => void
  onSearch: () => void
  loading: boolean
}

const TYPE_OPTIONS: { value: SearchType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'article', label: 'Articles' },
  { value: 'video', label: 'Videos' },
  { value: 'song', label: 'Songs' },
]

export function SearchBar({ query, onQueryChange, type, onTypeChange, onSearch, loading }: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearch()
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <input
        type="text"
        value={query}
        onChange={e => onQueryChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search articles, videos, songs…"
        className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-paradise-cream placeholder:text-white/50 flex-1 focus:outline-none focus:border-paradise-gold transition-colors"
      />
      <select
        value={type}
        onChange={e => onTypeChange(e.target.value as SearchType)}
        className="bg-white/10 border border-white/20 rounded-xl px-3 py-3 text-paradise-cream focus:outline-none focus:border-paradise-gold transition-colors appearance-none cursor-pointer"
      >
        {TYPE_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-paradise-green-deep text-paradise-cream">
            {opt.label}
          </option>
        ))}
      </select>
      <button
        onClick={onSearch}
        disabled={loading || !query.trim()}
        className="bg-paradise-gold text-paradise-green-deep font-semibold rounded-xl px-5 py-3 flex items-center gap-2 hover:bg-paradise-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
        Search
      </button>
    </div>
  )
}

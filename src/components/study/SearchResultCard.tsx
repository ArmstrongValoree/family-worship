import { useState } from 'react'
import { BookOpen, Play, Music, ExternalLink, ShieldCheck } from 'lucide-react'
import { isApprovedSource } from '../../lib/scraperApi'
import type { SearchResult } from '../../lib/scraperApi'

const TYPE_ICONS = {
  article: BookOpen,
  video: Play,
  song: Music,
}

interface SearchResultCardProps {
  result: SearchResult
  showAddButton?: boolean
  onAdd?: (result: SearchResult, readAhead: boolean) => void
}

export function SearchResultCard({ result, showAddButton = false, onAdd }: SearchResultCardProps) {
  const [showPanel, setShowPanel] = useState(false)
  const [readAhead, setReadAhead] = useState(false)

  if (!isApprovedSource(result.url)) return null

  const Icon = TYPE_ICONS[result.type]

  const handleConfirm = () => {
    onAdd?.(result, readAhead)
    setShowPanel(false)
    setReadAhead(false)
  }

  const handleCancel = () => {
    setShowPanel(false)
    setReadAhead(false)
  }

  return (
    <div>
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-paradise-gold/10 shrink-0 mt-0.5">
            <Icon size={16} className="text-paradise-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-display text-paradise-cream text-base leading-snug">{result.title}</h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-white/10 text-paradise-cream/60 border border-white/10 shrink-0">
                {result.source}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-paradise-green-light/10 text-paradise-green-light border border-paradise-green-light/20 shrink-0">
                <ShieldCheck size={11} />
                Approved Source
              </span>
            </div>
            {result.publication && (
              <p className="text-paradise-gold text-xs mb-1 truncate">{result.publication}</p>
            )}
            {result.snippet && (
              <p className="text-paradise-cream/60 text-sm line-clamp-2">{result.snippet}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 mt-3 ml-11">
          {showAddButton && (
            <button
              onClick={() => setShowPanel(p => !p)}
              className="bg-paradise-gold text-paradise-green-deep font-semibold rounded-lg px-3 py-1.5 text-xs hover:bg-paradise-gold-light transition-colors"
            >
              Add to Event
            </button>
          )}
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-paradise-green-light text-xs hover:text-paradise-gold transition-colors"
          >
            View Source <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {showPanel && (
        <div className="mt-1 mx-2 p-3 rounded-xl bg-white/5 border border-paradise-gold/20 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-paradise-cream/50 text-xs uppercase tracking-wide">Type:</span>
            <span className="text-paradise-cream text-xs capitalize font-medium">{result.type}</span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={readAhead}
              onChange={e => setReadAhead(e.target.checked)}
              className="accent-paradise-gold w-4 h-4"
            />
            <span className="text-paradise-cream/80 text-sm">Read Ahead</span>
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleConfirm}
              className="bg-paradise-gold text-paradise-green-deep font-semibold rounded-lg px-4 py-1.5 text-sm hover:bg-paradise-gold-light transition-colors"
            >
              Confirm
            </button>
            <button
              onClick={handleCancel}
              className="border border-paradise-cream/20 text-paradise-cream/70 rounded-lg px-4 py-1.5 text-sm hover:border-paradise-cream/40 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

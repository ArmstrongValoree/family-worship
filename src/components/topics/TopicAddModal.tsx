import { useState } from 'react'
import { X, Check, Search, Loader2 } from 'lucide-react'
import { isApprovedSource, searchJWMaterial, type SearchResult } from '../../lib/scraperApi'
import type { Topic } from '../../types'

interface TopicAddModalProps {
  householdId: string
  onAdd: (topic: Omit<Topic, 'id' | 'created_at'>) => Promise<void>
  onClose: () => void
}

export function TopicAddModal({ householdId, onAdd, onClose }: TopicAddModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [urlError, setUrlError] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)

  const urlValid = sourceUrl === '' || isApprovedSource(sourceUrl)

  function handleUrlChange(value: string) {
    setSourceUrl(value)
    setUrlError(value && !isApprovedSource(value) ? 'Only links from JW.org are permitted' : '')
  }

  async function handleSearch() {
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const results = await searchJWMaterial(searchQuery.trim(), 'all', 8)
      setSearchResults(results)
    } catch {
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  function applyResult(result: SearchResult) {
    setTitle(result.title)
    setSourceUrl(result.url)
    setUrlError('')
    setSearchResults([])
    setSearchQuery('')
  }

  async function handleSave() {
    if (!title.trim()) return
    if (sourceUrl && !isApprovedSource(sourceUrl)) {
      setUrlError('Only links from JW.org are permitted')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onAdd({
        household_id: householdId,
        title: title.trim(),
        description: description.trim() || undefined,
        source_url: sourceUrl.trim() || undefined,
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add topic')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-paradise-green-deep/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg backdrop-blur-lg bg-paradise-green-deep/90 border border-white/20 rounded-3xl p-6 z-10 max-h-[90vh] overflow-y-auto space-y-4">

        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-paradise-cream">Add a Topic</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-paradise-cream/50 hover:text-paradise-cream hover:bg-white/10 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* JW.org search */}
        <div className="space-y-2">
          <label className="block text-paradise-cream/60 text-xs font-semibold uppercase tracking-wide">
            Search JW.org for a topic
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. faith, prayer, endurance…"
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-paradise-cream placeholder:text-white/40 focus:outline-none focus:border-paradise-gold transition-colors text-sm"
            />
            <button
              onClick={handleSearch}
              disabled={searching || !searchQuery.trim()}
              className="bg-paradise-gold text-paradise-green-deep font-semibold rounded-xl px-4 py-2.5 hover:bg-paradise-gold-light transition-colors disabled:opacity-50 flex items-center gap-1.5 text-sm shrink-0"
            >
              {searching ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
              Search
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {searchResults.map((r, i) => (
                <button
                  key={i}
                  onClick={() => applyResult(r)}
                  className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-paradise-cream/80 text-xs hover:bg-paradise-gold/20 hover:border-paradise-gold/40 hover:text-paradise-cream transition-colors text-left truncate max-w-[200px]"
                  title={r.title}
                >
                  {r.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-white/10" />

        {/* Manual fields */}
        <div className="space-y-1.5">
          <label className="block text-paradise-cream/60 text-xs font-semibold uppercase tracking-wide">
            Topic Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Endurance Through Trials"
            required
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-paradise-cream placeholder:text-white/40 focus:outline-none focus:border-paradise-gold transition-colors text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-paradise-cream/60 text-xs font-semibold uppercase tracking-wide">
            Description <span className="text-paradise-cream/30">(optional)</span>
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Brief description of this topic…"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-paradise-cream placeholder:text-white/40 focus:outline-none focus:border-paradise-gold transition-colors text-sm resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-paradise-cream/60 text-xs font-semibold uppercase tracking-wide">
            Source URL <span className="text-paradise-cream/30">(optional — JW.org only)</span>
          </label>
          <div className="relative">
            <input
              type="url"
              value={sourceUrl}
              onChange={e => handleUrlChange(e.target.value)}
              placeholder="https://www.jw.org/…"
              className={[
                'w-full bg-white/10 border rounded-xl px-4 py-2.5 pr-10 text-paradise-cream placeholder:text-white/40 focus:outline-none transition-colors text-sm',
                urlError ? 'border-red-400/60 focus:border-red-400' : 'border-white/20 focus:border-paradise-gold',
              ].join(' ')}
            />
            {sourceUrl && urlValid && !urlError && (
              <Check size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-paradise-green-light" />
            )}
          </div>
          {urlError && <p className="text-red-400 text-xs px-1">{urlError}</p>}
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2.5">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-1">
          <button
            onClick={handleSave}
            disabled={saving || !title.trim() || !urlValid}
            className="flex-1 bg-paradise-gold text-paradise-green-deep font-semibold rounded-xl py-2.5 hover:bg-paradise-gold-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : 'Save Topic'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-paradise-cream/20 text-paradise-cream/70 rounded-xl py-2.5 hover:border-paradise-cream/40 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

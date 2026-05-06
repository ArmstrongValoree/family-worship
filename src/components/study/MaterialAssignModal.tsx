import { useState } from 'react'
import { X, CheckCircle } from 'lucide-react'
import { SearchBar } from './SearchBar'
import { SearchResultCard } from './SearchResultCard'
import { AssignedMaterialList } from './AssignedMaterialList'
import { useJWSearch } from '../../hooks/useJWSearch'
import { useStudyMaterial } from '../../hooks/useStudyMaterial'
import type { SearchResult } from '../../lib/scraperApi'
import type { EventWithMaterials } from '../../hooks/useEvents'

interface MaterialAssignModalProps {
  event: EventWithMaterials
  onClose: () => void
}

export function MaterialAssignModal({ event, onClose }: MaterialAssignModalProps) {
  const { query, setQuery, type, setType, results, loading, search } = useJWSearch()
  const { materials, addMaterial, removeMaterial } = useStudyMaterial(event.id)
  const [toast, setToast] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleAdd = async (result: SearchResult, readAhead: boolean) => {
    setAdding(true)
    try {
      await addMaterial({
        event_id: event.id,
        title: result.title,
        url: result.url,
        type: result.type,
        read_ahead: readAhead,
      })
      showToast('Material added successfully')
    } catch {
      showToast('Failed to add material')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-paradise-green-deep/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl backdrop-blur-lg bg-paradise-green-deep/80 border border-white/20 rounded-3xl p-6 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-2xl text-paradise-cream">Add Study Material</h2>
            <p className="text-paradise-cream/50 text-sm mt-0.5 truncate max-w-sm">
              {event.title || 'Family Worship Night'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-paradise-cream/50 hover:text-paradise-cream hover:bg-white/10 transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {toast && (
          <div className="mb-4 p-3 rounded-xl bg-paradise-green-mid/40 border border-paradise-green-light/30 flex items-center gap-2">
            <CheckCircle size={15} className="text-paradise-green-light shrink-0" />
            <span className="text-paradise-cream text-sm">{toast}</span>
          </div>
        )}

        <div className="mb-5">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            type={type}
            onTypeChange={setType}
            onSearch={search}
            loading={loading || adding}
          />
        </div>

        {results.length > 0 && (
          <div className="mb-6 space-y-3">
            {results.map((result, i) => (
              <SearchResultCard
                key={i}
                result={result}
                showAddButton
                onAdd={handleAdd}
              />
            ))}
          </div>
        )}

        <div>
          <p className="text-paradise-cream/50 text-xs uppercase tracking-wide font-semibold mb-3">
            Currently Assigned
          </p>
          <AssignedMaterialList materials={materials} isHH onRemove={removeMaterial} />
        </div>
      </div>
    </div>
  )
}

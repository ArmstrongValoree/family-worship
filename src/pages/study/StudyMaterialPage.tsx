import { useState } from 'react'
import { BookOpen, CalendarDays, ChevronRight } from 'lucide-react'
import { AppShell } from '../../components/layout/AppShell'
import { SearchBar } from '../../components/study/SearchBar'
import { SearchResultCard } from '../../components/study/SearchResultCard'
import { AssignedMaterialList } from '../../components/study/AssignedMaterialList'
import { MaterialAssignModal } from '../../components/study/MaterialAssignModal'
import { useAuthContext } from '../../context/AuthContext'
import { useEvents, type EventWithMaterials } from '../../hooks/useEvents'
import { useJWSearch } from '../../hooks/useJWSearch'
import { useStudyMaterial } from '../../hooks/useStudyMaterial'
import { supabase } from '../../lib/supabase'
import type { SearchResult } from '../../lib/scraperApi'

function formatEventDate(isoString: string) {
  const d = new Date(isoString)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

interface FamilyEventDrawerProps {
  event: EventWithMaterials
  onClose: () => void
}

function FamilyEventDrawer({ event, onClose }: FamilyEventDrawerProps) {
  const { materials } = useStudyMaterial(event.id)
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-paradise-green-deep/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg backdrop-blur-lg bg-paradise-green-deep/80 border border-white/20 rounded-3xl p-6 z-10 max-h-[80vh] overflow-y-auto">
        <h2 className="font-display text-2xl text-paradise-cream mb-1">
          {event.title || 'Family Worship Evening'}
        </h2>
        <p className="text-paradise-cream/50 text-sm mb-5">{formatEventDate(event.scheduled_at)}</p>
        <AssignedMaterialList materials={materials} isHH={false} />
      </div>
    </div>
  )
}

interface AddToEventSheetProps {
  result: SearchResult
  events: EventWithMaterials[]
  onClose: () => void
  onSuccess: () => void
}

function AddToEventSheet({ result, events, onClose, onSuccess }: AddToEventSheetProps) {
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id ?? '')
  const [readAhead, setReadAhead] = useState(false)
  const [adding, setAdding] = useState(false)

  const handleConfirm = async () => {
    if (!selectedEventId) return
    setAdding(true)
    try {
      await supabase.from('study_materials').insert({
        event_id: selectedEventId,
        title: result.title,
        url: result.url,
        type: result.type,
        read_ahead: readAhead,
      })
      onSuccess()
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-paradise-green-deep/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md backdrop-blur-lg bg-paradise-green-deep/80 border border-white/20 rounded-3xl p-6 z-10">
        <h2 className="font-display text-xl text-paradise-cream mb-1">Add to Event</h2>
        <p className="text-paradise-cream/60 text-sm mb-4 truncate">{result.title}</p>

        <label className="block mb-3">
          <span className="text-paradise-cream/50 text-xs uppercase tracking-wide font-semibold block mb-1.5">
            Choose Event
          </span>
          <select
            value={selectedEventId}
            onChange={e => setSelectedEventId(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-paradise-cream focus:outline-none focus:border-paradise-gold appearance-none"
          >
            {events.map(ev => (
              <option key={ev.id} value={ev.id} className="bg-paradise-green-deep text-paradise-cream">
                {ev.title || 'Family Worship Evening'} — {formatEventDate(ev.scheduled_at)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 cursor-pointer mb-5">
          <input
            type="checkbox"
            checked={readAhead}
            onChange={e => setReadAhead(e.target.checked)}
            className="accent-paradise-gold w-4 h-4"
          />
          <span className="text-paradise-cream/80 text-sm">Read Ahead</span>
        </label>

        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            disabled={adding || !selectedEventId}
            className="flex-1 bg-paradise-gold text-paradise-green-deep font-semibold rounded-xl py-2.5 hover:bg-paradise-gold-light transition-colors disabled:opacity-50"
          >
            {adding ? 'Adding…' : 'Add Material'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-paradise-cream/20 text-paradise-cream/70 rounded-xl py-2.5 hover:border-paradise-cream/40 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export function StudyMaterialPage() {
  const { profile } = useAuthContext()
  const isHH = profile?.role === 'head_of_household'
  const { events } = useEvents(profile?.household_id)
  const { query, setQuery, type, setType, results, loading, search } = useJWSearch()

  const [hhModalEvent, setHhModalEvent] = useState<EventWithMaterials | null>(null)
  const [familyDrawerEvent, setFamilyDrawerEvent] = useState<EventWithMaterials | null>(null)
  const [addTarget, setAddTarget] = useState<SearchResult | null>(null)
  const [addSuccess, setAddSuccess] = useState(false)

  const upcomingEvents = events.filter(e => new Date(e.scheduled_at) >= new Date())

  const handleEventClick = (event: EventWithMaterials) => {
    if (isHH) {
      setHhModalEvent(event)
    } else {
      setFamilyDrawerEvent(event)
    }
  }

  const handleAddSuccess = () => {
    setAddTarget(null)
    setAddSuccess(true)
    setTimeout(() => setAddSuccess(false), 3000)
  }

  if (!profile?.household_id) {
    return (
      <AppShell>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center gap-3">
          <BookOpen size={40} className="text-paradise-gold/60" />
          <p className="font-display text-xl text-paradise-cream">Study Materials</p>
          <p className="text-paradise-cream/50 text-sm max-w-xs">
            Join or create a household to access study materials
          </p>
          <a
            href="https://www.jw.org/en/library/bible/study-bible/books/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-paradise-gold text-sm hover:underline"
          >
            Browse the Bible online
          </a>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="px-4 py-6 max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="font-display text-3xl text-paradise-cream">Study Materials</h1>
          <p className="text-paradise-cream/60 text-sm mt-1">Prepare for your next Family Worship evening</p>
        </div>

        {/* Upcoming events row */}
        {upcomingEvents.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays size={15} className="text-paradise-gold" />
              <h2 className="font-display text-xl text-paradise-cream">Upcoming Events</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {upcomingEvents.map(event => (
                <button
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className="flex-shrink-0 w-44 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-left hover:bg-white/15 hover:border-paradise-gold/30 transition-colors group"
                >
                  <p className="font-display text-paradise-cream text-sm leading-snug mb-1 truncate">
                    {event.title || 'Family Worship Evening'}
                  </p>
                  <p className="text-paradise-gold text-xs mb-2">{formatEventDate(event.scheduled_at)}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-paradise-cream/40 text-xs">
                      {event.study_materials.length} material{event.study_materials.length !== 1 ? 's' : ''}
                    </span>
                    <ChevronRight size={14} className="text-paradise-cream/30 group-hover:text-paradise-gold transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Search section */}
        <section>
          <h2 className="font-display text-2xl text-paradise-cream mb-3">Search JW.org Library</h2>

          <SearchBar
            query={query}
            onQueryChange={setQuery}
            type={type}
            onTypeChange={setType}
            onSearch={search}
            loading={loading}
          />

          {addSuccess && (
            <p className="mt-3 text-paradise-green-light text-sm">Material added successfully.</p>
          )}

          {results.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {results.map((result, i) => (
                <SearchResultCard
                  key={i}
                  result={result}
                  showAddButton={isHH}
                  onAdd={isHH ? (r) => setAddTarget(r) : undefined}
                />
              ))}
            </div>
          ) : (
            !loading && query === '' && (
              <div className="mt-8 flex flex-col items-center gap-3 text-paradise-cream/40">
                <BookOpen size={36} />
                <p className="text-sm text-center max-w-xs">
                  Search for articles, videos, and songs from JW.org
                </p>
              </div>
            )
          )}
        </section>
      </div>

      {hhModalEvent && (
        <MaterialAssignModal event={hhModalEvent} onClose={() => setHhModalEvent(null)} />
      )}

      {familyDrawerEvent && (
        <FamilyEventDrawer event={familyDrawerEvent} onClose={() => setFamilyDrawerEvent(null)} />
      )}

      {addTarget && upcomingEvents.length > 0 && (
        <AddToEventSheet
          result={addTarget}
          events={upcomingEvents}
          onClose={() => setAddTarget(null)}
          onSuccess={handleAddSuccess}
        />
      )}
    </AppShell>
  )
}

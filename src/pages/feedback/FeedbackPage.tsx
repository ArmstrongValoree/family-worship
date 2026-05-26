import { useState, useEffect, useMemo } from 'react'
import { Loader2, MessageSquare } from 'lucide-react'
import { AppShell } from '../../components/layout/AppShell'
import { FeedbackModal } from '../../components/feedback/FeedbackModal'
import { StarRating } from '../../components/feedback/StarRating'
import { useAuthContext } from '../../context/AuthContext'
import { useEvents } from '../../hooks/useEvents'
import { supabase } from '../../lib/supabase'
import type { FamilyWorshipEvent, FeedbackEntry } from '../../types'

interface EventSummary {
  count: number
  avgRating: number
  userSubmitted: boolean
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function FeedbackPage() {
  const { profile } = useAuthContext()
  const isHH = profile?.role === 'head_of_household'
  const { events, loading: eventsLoading } = useEvents(profile?.household_id)

  const pastEvents = useMemo(
    () =>
      events
        .filter(e => new Date(e.scheduled_at) < new Date())
        .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime()),
    [events]
  )

  const [summaries, setSummaries] = useState<Map<string, EventSummary>>(new Map())
  const [selectedEvent, setSelectedEvent] = useState<FamilyWorshipEvent | null>(null)

  useEffect(() => {
    if (!profile || pastEvents.length === 0) return
    const ids = pastEvents.map(e => e.id)

    supabase
      .from('feedback_entries')
      .select('*')
      .in('event_id', ids)
      .then(({ data }) => {
        const entries = (data ?? []) as FeedbackEntry[]
        const map = new Map<string, EventSummary>()
        for (const event of pastEvents) {
          const ev = entries.filter(f => f.event_id === event.id)
          map.set(event.id, {
            count: ev.length,
            avgRating:
              ev.length === 0
                ? 0
                : Math.round((ev.reduce((s, f) => s + f.rating, 0) / ev.length) * 10) / 10,
            userSubmitted: ev.some(f => f.profile_id === profile.id),
          })
        }
        setSummaries(map)
      })
  }, [pastEvents, profile])

  function handleModalClose() {
    setSelectedEvent(null)
    // Re-fetch summaries to reflect any newly submitted feedback
    if (!profile || pastEvents.length === 0) return
    const ids = pastEvents.map(e => e.id)
    supabase
      .from('feedback_entries')
      .select('*')
      .in('event_id', ids)
      .then(({ data }) => {
        const entries = (data ?? []) as FeedbackEntry[]
        const map = new Map<string, EventSummary>()
        for (const event of pastEvents) {
          const ev = entries.filter(f => f.event_id === event.id)
          map.set(event.id, {
            count: ev.length,
            avgRating:
              ev.length === 0
                ? 0
                : Math.round((ev.reduce((s, f) => s + f.rating, 0) / ev.length) * 10) / 10,
            userSubmitted: ev.some(f => f.profile_id === profile.id),
          })
        }
        setSummaries(map)
      })
  }

  return (
    <AppShell>
      <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="font-display text-3xl text-paradise-cream">Feedback</h1>
          <p className="text-paradise-cream/60 text-sm mt-1">
            Rate your Family Worship evenings
          </p>
        </div>

        {eventsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 size={28} className="text-paradise-gold animate-spin" />
          </div>
        ) : pastEvents.length === 0 ? (
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 text-center space-y-2">
            <MessageSquare size={32} className="text-paradise-gold/50 mx-auto" />
            <p className="text-paradise-cream/60 text-sm leading-relaxed">
              No past Family Worship evenings yet.
              <br />
              Check back after your first evening together! 🌿
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {isHH && (
              <p className="text-paradise-cream/40 text-xs uppercase tracking-widest font-semibold px-1">
                Feedback Overview
              </p>
            )}
            {pastEvents.map(event => {
              const summary = summaries.get(event.id)
              return (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="w-full text-left backdrop-blur-md bg-white/5 hover:bg-white/10 border border-white/10 hover:border-paradise-gold/30 rounded-2xl p-4 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <p className="font-display text-paradise-cream text-lg leading-snug">
                        {event.title || 'Family Worship Evening'}
                      </p>
                      <p className="text-paradise-cream/50 text-xs">{formatDate(event.scheduled_at)}</p>
                      {summary && summary.avgRating > 0 && (
                        <StarRating rating={summary.avgRating} readonly />
                      )}
                      {isHH && summary && (
                        <p className="text-paradise-cream/40 text-xs">
                          {summary.count} member{summary.count !== 1 ? 's' : ''} responded
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 mt-0.5">
                      {summary?.userSubmitted ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-paradise-green-light/15 text-paradise-green-light border border-paradise-green-light/20">
                          Feedback Given ✓
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-paradise-gold/15 text-paradise-gold border border-paradise-gold/20">
                          Give Feedback
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {selectedEvent && (
        <FeedbackModal event={selectedEvent} onClose={handleModalClose} />
      )}
    </AppShell>
  )
}

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { AppShell } from '../../components/layout/AppShell'
import { EventCard } from '../../components/calendar/EventCard'
import { EventDetailModal } from '../../components/calendar/EventDetailModal'
import { EventFormModal } from '../../components/calendar/EventFormModal'
import { DateChangeModal } from '../../components/calendar/DateChangeModal'
import { DateChangeRequestsList } from '../../components/calendar/DateChangeRequestsList'
import { useAuthContext } from '../../context/AuthContext'
import { useEvents } from '../../hooks/useEvents'
import type { EventWithMaterials } from '../../hooks/useEvents'

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function CalendarPage() {
  const { profile } = useAuthContext()
  const { events, refetch } = useEvents(profile?.household_id)
  const isHH = profile?.role === 'head_of_household'

  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())

  const [selectedEvent, setSelectedEvent] = useState<EventWithMaterials | null>(null)
  const [editingEvent, setEditingEvent] = useState<EventWithMaterials | null>(null)
  const [showEventForm, setShowEventForm] = useState(false)
  const [showDateChange, setShowDateChange] = useState(false)
  const [prefilledDate, setPrefilledDate] = useState('')

  function prevMonth() {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }

  function nextMonth() {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }

  // Calendar grid computation
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7

  // Map day → events for this month
  const eventsOnDay = new Map<number, EventWithMaterials[]>()
  events.forEach(event => {
    const d = new Date(event.scheduled_at)
    if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
      const day = d.getDate()
      eventsOnDay.set(day, [...(eventsOnDay.get(day) ?? []), event])
    }
  })

  // Upcoming events (next 3 from now)
  const upcoming = events
    .filter(e => new Date(e.scheduled_at) > today)
    .slice(0, 3)

  function handleDayClick(day: number) {
    const dayEvents = eventsOnDay.get(day)
    if (dayEvents && dayEvents.length > 0) {
      setSelectedEvent(dayEvents[0])
    } else if (isHH) {
      const paddedMonth = String(currentMonth + 1).padStart(2, '0')
      const paddedDay = String(day).padStart(2, '0')
      setPrefilledDate(`${currentYear}-${paddedMonth}-${paddedDay}`)
      setEditingEvent(null)
      setShowEventForm(true)
    }
  }

  function handleEventSaved() {
    setShowEventForm(false)
    setEditingEvent(null)
    setPrefilledDate('')
    refetch()
  }

  function handleEditFromDetail() {
    if (!selectedEvent) return
    setEditingEvent(selectedEvent)
    setSelectedEvent(null)
    setShowEventForm(true)
  }

  function handleRequestDateChange() {
    setShowDateChange(true)
  }

  function handleDateChangeSubmitted() {
    setShowDateChange(false)
    setSelectedEvent(null)
  }

  return (
    <AppShell>
      <div className="px-4 py-6 max-w-lg mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl text-paradise-cream">Family Calendar</h1>
          {isHH && (
            <button
              onClick={() => { setEditingEvent(null); setPrefilledDate(''); setShowEventForm(true) }}
              className="flex items-center gap-1.5 bg-paradise-gold text-paradise-green-deep text-sm font-semibold px-3 py-2 rounded-xl hover:bg-paradise-gold-light transition-colors"
            >
              <Plus size={16} />
              Schedule
            </button>
          )}
        </div>

        {/* Month navigation */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl text-paradise-cream/60 hover:text-paradise-cream hover:bg-white/10 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <p className="font-display text-xl text-paradise-cream">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </p>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl text-paradise-cream/60 hover:text-paradise-cream hover:bg-white/10 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAY_HEADERS.map(d => (
              <div key={d} className="text-center text-paradise-green-light text-xs font-medium py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: totalCells }, (_, i) => {
              const day = i - firstDayOfMonth + 1
              const isCurrentMonth = day >= 1 && day <= daysInMonth
              const isToday =
                isCurrentMonth &&
                day === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear()
              const hasEvent = isCurrentMonth && eventsOnDay.has(day)

              return (
                <button
                  key={i}
                  disabled={!isCurrentMonth}
                  onClick={() => isCurrentMonth && handleDayClick(day)}
                  className={[
                    'flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors relative',
                    !isCurrentMonth
                      ? 'opacity-0 pointer-events-none'
                      : isToday
                      ? 'border border-paradise-gold text-paradise-gold font-bold'
                      : hasEvent
                      ? 'bg-white/5 text-paradise-cream hover:bg-white/15 cursor-pointer'
                      : 'text-paradise-cream/50 hover:bg-white/10',
                  ].join(' ')}
                >
                  <span className="text-sm leading-none">{isCurrentMonth ? day : ''}</span>
                  {hasEvent && (
                    <span className="w-1 h-1 rounded-full bg-paradise-gold mt-1" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Upcoming worship nights */}
        <div>
          <h2 className="font-display text-xl text-paradise-cream mb-3">Upcoming Family Worship Evenings</h2>
          {upcoming.length === 0 ? (
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 text-paradise-cream/50 text-sm flex items-center gap-2">
              No Family Worship evenings scheduled yet — {isHH ? 'tap Schedule to add one.' : 'your Head of Household will schedule one soon.'}
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map(event => (
                <EventCard key={event.id} event={event} onView={setSelectedEvent} />
              ))}
            </div>
          )}
        </div>

        {/* Date change requests — HH only */}
        {isHH && (
          <div>
            <h2 className="font-display text-xl text-paradise-cream mb-3">Date Change Requests</h2>
            <DateChangeRequestsList events={events} onUpdated={refetch} />
          </div>
        )}

      </div>

      {/* Modals */}
      {selectedEvent && !showDateChange && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEdit={handleEditFromDetail}
          onRequestDateChange={handleRequestDateChange}
        />
      )}

      {showEventForm && profile?.household_id && (
        <EventFormModal
          householdId={profile.household_id}
          initialDate={prefilledDate}
          event={editingEvent ?? undefined}
          onClose={() => { setShowEventForm(false); setEditingEvent(null) }}
          onSaved={handleEventSaved}
        />
      )}

      {showDateChange && selectedEvent && (
        <DateChangeModal
          event={selectedEvent}
          onClose={() => setShowDateChange(false)}
          onSubmitted={handleDateChangeSubmitted}
        />
      )}
    </AppShell>
  )
}

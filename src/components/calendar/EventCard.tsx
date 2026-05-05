import { BookOpen, Play, Music, ChevronRight } from 'lucide-react'
import type { EventWithMaterials } from '../../hooks/useEvents'

const materialIcons = {
  article: BookOpen,
  video: Play,
  song: Music,
}

interface EventCardProps {
  event: EventWithMaterials
  onView: (event: EventWithMaterials) => void
}

function formatDateTime(isoString: string) {
  const d = new Date(isoString)
  return {
    dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'long' }),
    date: d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  }
}

export function EventCard({ event, onView }: EventCardProps) {
  const { dayOfWeek, date, time } = formatDateTime(event.scheduled_at)

  return (
    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-paradise-cream font-semibold truncate">
            {event.title || 'Family Worship Night'}
          </p>
          <p className="text-paradise-gold text-sm mt-0.5">{dayOfWeek} · {date}</p>
          <p className="text-paradise-cream/50 text-xs">{time}</p>
        </div>

        {event.study_materials.length > 0 && (
          <div className="flex gap-1.5 shrink-0 pt-0.5">
            {event.study_materials.map((m, i) => {
              const Icon = materialIcons[m.type]
              return (
                <div key={i} className="p-1.5 rounded-lg bg-white/10">
                  <Icon size={13} className="text-paradise-cream/60" />
                </div>
              )
            })}
          </div>
        )}
      </div>

      <button
        onClick={() => onView(event)}
        className="w-full flex items-center justify-between text-paradise-gold/80 hover:text-paradise-gold text-sm font-medium transition-colors"
      >
        View Details
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

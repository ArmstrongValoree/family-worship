import { useEffect, useState } from 'react'
import { X, BookOpen, Play, Music, Lock } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuthContext } from '../../context/AuthContext'
import type { EventWithMaterials } from '../../hooks/useEvents'
import type { MemberInstruction } from '../../types'

const materialIcons = {
  article: BookOpen,
  video: Play,
  song: Music,
}

interface EventDetailModalProps {
  event: EventWithMaterials
  onClose: () => void
  onEdit: () => void
  onRequestDateChange: () => void
}

function formatDateTime(isoString: string) {
  const d = new Date(isoString)
  return {
    dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'long' }),
    date: d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  }
}

export function EventDetailModal({ event, onClose, onEdit, onRequestDateChange }: EventDetailModalProps) {
  const { profile } = useAuthContext()
  const [instruction, setInstruction] = useState<MemberInstruction | null>(null)
  const isHH = profile?.role === 'head_of_household'
  const { dayOfWeek, date, time } = formatDateTime(event.scheduled_at)

  useEffect(() => {
    if (!profile) return
    supabase
      .from('member_instructions')
      .select('*')
      .eq('event_id', event.id)
      .eq('profile_id', profile.id)
      .maybeSingle()
      .then(({ data }) => setInstruction(data as MemberInstruction | null))
  }, [event.id, profile])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-paradise-green-deep/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg backdrop-blur-lg bg-paradise-green-deep/80 border border-white/20 rounded-3xl p-6 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-display text-2xl text-paradise-cream">
              {event.title || 'Family Worship Night'}
            </h2>
            <p className="text-paradise-gold text-sm mt-1">{dayOfWeek} · {date}</p>
            <p className="text-paradise-cream/50 text-xs">{time}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-paradise-cream/50 hover:text-paradise-cream hover:bg-white/10 transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {event.notes && (
          <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="text-paradise-cream/70 text-sm leading-relaxed">{event.notes}</p>
          </div>
        )}

        {event.study_materials.length > 0 && (
          <div className="mb-4">
            <p className="text-paradise-cream/50 text-xs uppercase tracking-wide font-semibold mb-2">
              Study Materials
            </p>
            <div className="space-y-2">
              {event.study_materials.map(m => {
                const Icon = materialIcons[m.type]
                return (
                  <a
                    key={m.id}
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <Icon size={16} className="text-paradise-gold shrink-0" />
                    <span className="text-paradise-cream text-sm flex-1 min-w-0 truncate">{m.title}</span>
                    <span className="text-paradise-cream/30 text-xs capitalize">{m.type}</span>
                  </a>
                )
              })}
            </div>
          </div>
        )}

        {instruction && (
          <div className="mb-4 p-3 rounded-xl bg-paradise-gold/10 border border-paradise-gold/20 flex gap-3">
            <Lock size={15} className="text-paradise-gold shrink-0 mt-0.5" />
            <div>
              <p className="text-paradise-gold text-xs font-semibold uppercase tracking-wide mb-1">
                Your Assignment
              </p>
              <p className="text-paradise-cream/80 text-sm leading-relaxed">{instruction.instruction}</p>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-2">
          {isHH ? (
            <button
              onClick={onEdit}
              className="flex-1 bg-paradise-gold text-paradise-green-deep font-semibold rounded-xl py-2.5 hover:bg-paradise-gold-light transition-colors text-sm"
            >
              Edit Event
            </button>
          ) : (
            <button
              onClick={onRequestDateChange}
              className="flex-1 border border-paradise-cream/20 text-paradise-cream/70 hover:text-paradise-cream hover:border-paradise-cream/40 rounded-xl py-2.5 transition-colors text-sm font-medium"
            >
              Request Date Change
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

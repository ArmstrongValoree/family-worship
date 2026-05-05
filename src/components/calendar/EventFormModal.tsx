import { useState } from 'react'
import { X, BookOpen, Play, Music, Trash2, Loader2 } from 'lucide-react'
import { useAuthContext } from '../../context/AuthContext'
import { useEventForm } from '../../hooks/useEventForm'
import type { EventWithMaterials } from '../../hooks/useEvents'
import type { StudyMaterial } from '../../types'

interface EventFormModalProps {
  householdId: string
  initialDate?: string
  event?: EventWithMaterials
  onClose: () => void
  onSaved: () => void
}

const materialTypeConfig = [
  { type: 'article' as const, icon: BookOpen, label: 'Article' },
  { type: 'video' as const, icon: Play, label: 'Video' },
  { type: 'song' as const, icon: Music, label: 'Song' },
]

const inputClass =
  'w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder:text-white/50 focus:outline-none focus:border-paradise-gold transition-colors text-sm'

export function EventFormModal({ householdId, initialDate, event, onClose, onSaved }: EventFormModalProps) {
  const { profile } = useAuthContext()

  const initDate = event?.scheduled_at
    ? new Date(event.scheduled_at).toISOString().slice(0, 10)
    : (initialDate ?? '')
  const initTime = event?.scheduled_at
    ? new Date(event.scheduled_at).toTimeString().slice(0, 5)
    : '19:00'

  const { fields, materials, setField, addMaterial, removeMaterial, reset, submit, loading, error } =
    useEventForm({
      title: event?.title ?? '',
      date: initDate,
      time: initTime,
      notes: event?.notes ?? '',
      topic_id: event?.topic_id ?? '',
    })

  const [addingType, setAddingType] = useState<StudyMaterial['type'] | null>(null)
  const [draftTitle, setDraftTitle] = useState('')
  const [draftUrl, setDraftUrl] = useState('')

  function confirmAddMaterial() {
    if (!addingType || !draftTitle || !draftUrl) return
    addMaterial({ type: addingType, title: draftTitle.trim(), url: draftUrl.trim() })
    setAddingType(null)
    setDraftTitle('')
    setDraftUrl('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return
    try {
      await submit(householdId, profile.id, event?.id)
      reset()
      onSaved()
    } catch {
      // error state set inside hook
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-paradise-green-deep/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg backdrop-blur-lg bg-paradise-green-deep/80 border border-white/20 rounded-3xl p-6 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl text-paradise-cream">
            {event ? 'Edit Event' : 'Schedule Worship Night'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-paradise-cream/50 hover:text-paradise-cream hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-paradise-cream/60 text-xs font-semibold uppercase tracking-wide">
              Title (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Bible Study Night"
              value={fields.title}
              onChange={e => setField('title', e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-paradise-cream/60 text-xs font-semibold uppercase tracking-wide">Date</label>
              <input
                type="date"
                value={fields.date}
                onChange={e => setField('date', e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-paradise-cream/60 text-xs font-semibold uppercase tracking-wide">Time</label>
              <input
                type="time"
                value={fields.time}
                onChange={e => setField('time', e.target.value)}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-paradise-cream/60 text-xs font-semibold uppercase tracking-wide">Notes</label>
            <textarea
              rows={3}
              placeholder="Any notes for this session..."
              value={fields.notes}
              onChange={e => setField('notes', e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Study materials */}
          <div className="space-y-2">
            <label className="block text-paradise-cream/60 text-xs font-semibold uppercase tracking-wide">
              Study Materials
            </label>

            {materials.map((m, i) => {
              const cfg = materialTypeConfig.find(c => c.type === m.type)!
              const Icon = cfg.icon
              return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Icon size={15} className="text-paradise-gold shrink-0" />
                  <span className="text-paradise-cream text-sm flex-1 min-w-0 truncate">{m.title}</span>
                  <button
                    type="button"
                    onClick={() => removeMaterial(i)}
                    className="text-paradise-cream/30 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )
            })}

            {addingType ? (
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <input
                  type="text"
                  placeholder="Title"
                  value={draftTitle}
                  onChange={e => setDraftTitle(e.target.value)}
                  className={inputClass}
                />
                <input
                  type="url"
                  placeholder="https://..."
                  value={draftUrl}
                  onChange={e => setDraftUrl(e.target.value)}
                  className={inputClass}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={confirmAddMaterial}
                    disabled={!draftTitle || !draftUrl}
                    className="flex-1 bg-paradise-gold text-paradise-green-deep text-xs font-semibold rounded-lg py-2 hover:bg-paradise-gold-light transition-colors disabled:opacity-50"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAddingType(null); setDraftTitle(''); setDraftUrl('') }}
                    className="flex-1 border border-white/20 text-paradise-cream/60 text-xs rounded-lg py-2 hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                {materialTypeConfig.map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAddingType(type)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-paradise-cream/60 hover:text-paradise-cream hover:bg-white/10 transition-colors text-xs"
                  >
                    <Icon size={13} />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-paradise-cream/20 text-paradise-cream/70 hover:text-paradise-cream rounded-xl py-2.5 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-paradise-gold text-paradise-green-deep font-semibold rounded-xl py-2.5 hover:bg-paradise-gold-light transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : 'Save Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { X, Loader2, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Topic, FamilyWorshipEvent, Profile } from '../../types'

interface HHOverrideModalProps {
  event: FamilyWorshipEvent
  topics: Topic[]
  profile: Profile
  onClose: () => void
  onOverridden: () => void
}

function formatEventDate(isoString: string) {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  })
}

export function HHOverrideModal({ event, topics, profile, onClose, onOverridden }: HHOverrideModalProps) {
  const [selectedTopicId, setSelectedTopicId] = useState(topics[0]?.id ?? '')
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selectedTopicId || !reason.trim()) return
    setSubmitting(true)
    setError('')

    try {
      const { error: updateErr } = await supabase
        .from('family_worship_events')
        .update({ topic_id: selectedTopicId })
        .eq('id', event.id)
      if (updateErr) throw updateErr

      const message = `The topic for the ${formatEventDate(event.scheduled_at)} Family Worship Evening has been updated by the Head of Household: ${reason.trim()}`

      const { error: notifErr } = await supabase
        .from('notifications')
        .insert({
          household_id: event.household_id,
          message,
          created_by: profile.id,
        })
      if (notifErr) throw notifErr

      setDone(true)
      setTimeout(() => {
        onOverridden()
        onClose()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to override topic')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-paradise-green-deep/70 backdrop-blur-sm" />
        <div className="relative backdrop-blur-lg bg-paradise-green-deep/90 border border-white/20 rounded-3xl p-8 z-10 text-center space-y-3">
          <CheckCircle size={40} className="text-paradise-green-light mx-auto" />
          <p className="font-display text-xl text-paradise-cream">Topic updated</p>
          <p className="text-paradise-cream/60 text-sm">Household members have been notified.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-paradise-green-deep/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md backdrop-blur-lg bg-paradise-green-deep/90 border border-white/20 rounded-3xl p-6 z-10">

        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl text-paradise-cream">Override Topic Selection</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-paradise-cream/50 hover:text-paradise-cream hover:bg-white/10 transition-colors">
            <X size={20} />
          </button>
        </div>

        <p className="text-paradise-cream/50 text-sm mb-4">
          Overriding the topic for the{' '}
          <span className="text-paradise-gold">{formatEventDate(event.scheduled_at)}</span> evening.
          All household members will be notified.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-paradise-cream/60 text-xs font-semibold uppercase tracking-wide">
              Select Topic
            </label>
            <select
              value={selectedTopicId}
              onChange={e => setSelectedTopicId(e.target.value)}
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-paradise-cream focus:outline-none focus:border-paradise-gold transition-colors appearance-none text-sm"
            >
              {topics.map(t => (
                <option key={t.id} value={t.id} className="bg-paradise-green-deep text-paradise-cream">
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-paradise-cream/60 text-xs font-semibold uppercase tracking-wide">
              Reason for Override <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Briefly explain why you are selecting this topic…"
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-paradise-cream placeholder:text-white/40 focus:outline-none focus:border-paradise-gold transition-colors text-sm resize-none"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={submitting || !selectedTopicId || !reason.trim()}
              className="flex-1 bg-paradise-gold text-paradise-green-deep font-semibold rounded-xl py-2.5 text-sm hover:bg-paradise-gold-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? <><Loader2 size={16} className="animate-spin" /> Confirming…</> : 'Confirm Override'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-paradise-cream/20 text-paradise-cream/70 rounded-xl py-2.5 text-sm hover:border-paradise-cream/40 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

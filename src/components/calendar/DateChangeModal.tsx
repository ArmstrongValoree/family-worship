import { useState } from 'react'
import { X, Loader2, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuthContext } from '../../context/AuthContext'
import type { FamilyWorshipEvent } from '../../types'

interface DateChangeModalProps {
  event: FamilyWorshipEvent
  onClose: () => void
  onSubmitted: () => void
}

const inputClass =
  'w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder:text-white/50 focus:outline-none focus:border-paradise-gold transition-colors text-sm'

export function DateChangeModal({ event, onClose, onSubmitted }: DateChangeModalProps) {
  const { profile } = useAuthContext()

  const [date, setDate] = useState('')
  const [time, setTime] = useState('19:00')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return
    setError('')
    setLoading(true)

    try {
      const requested_date = new Date(`${date}T${time}`).toISOString()

      const { error: insertError } = await supabase.from('date_change_requests').insert({
        event_id: event.id,
        requested_by: profile.id,
        requested_date,
        reason: reason.trim() || null,
      })

      if (insertError) throw insertError

      setSubmitted(true)
      setTimeout(onSubmitted, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-paradise-green-deep/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md backdrop-blur-lg bg-paradise-green-deep/80 border border-white/20 rounded-3xl p-6 z-10">
        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle size={40} className="text-paradise-green-light" />
            <p className="font-display text-xl text-paradise-cream">Request Sent</p>
            <p className="text-paradise-cream/60 text-sm">Your Head of Household will review it.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-2xl text-paradise-cream">Request Date Change</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-paradise-cream/50 hover:text-paradise-cream hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-paradise-cream/60 text-xs font-semibold uppercase tracking-wide">
                    Requested Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-paradise-cream/60 text-xs font-semibold uppercase tracking-wide">
                    Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-paradise-cream/60 text-xs font-semibold uppercase tracking-wide">
                  Reason (optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Let them know why..."
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2.5">
                  {error}
                </p>
              )}

              <div className="flex gap-3">
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
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : 'Submit Request'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

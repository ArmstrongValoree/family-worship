import { useState } from 'react'
import { StarRating } from './StarRating'
import type { FamilyWorshipEvent } from '../../types'
import type { FeedbackWithProfile } from '../../hooks/useFeedback'

interface FeedbackFormProps {
  event: FamilyWorshipEvent
  userFeedback: FeedbackWithProfile | null
  hasSubmitted: boolean
  submitFeedback: (rating: number, comment?: string) => Promise<void>
  loading: boolean
}

export function FeedbackForm({
  event,
  userFeedback,
  hasSubmitted,
  submitFeedback,
  loading,
}: FeedbackFormProps) {
  const [rating, setRating] = useState(userFeedback?.rating ?? 0)
  const [comment, setComment] = useState(userFeedback?.comment ?? '')
  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isPast = new Date(event.scheduled_at) < new Date()
  if (!isPast) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0) return
    setSubmitting(true)
    setError(null)
    try {
      await submitFeedback(rating, comment.trim() || undefined)
      setEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback')
    } finally {
      setSubmitting(false)
    }
  }

  if (hasSubmitted && !editing) {
    return (
      <div className="space-y-3">
        <p className="text-paradise-green-light text-sm font-semibold">
          Thank you for your feedback! 🌿
        </p>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <StarRating rating={userFeedback!.rating} readonly />
          {userFeedback!.comment && (
            <p className="text-paradise-cream/70 text-sm leading-relaxed">{userFeedback!.comment}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            setRating(userFeedback!.rating)
            setComment(userFeedback!.comment ?? '')
            setEditing(true)
          }}
          className="text-paradise-gold text-sm hover:underline"
        >
          Edit Feedback
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <p className="text-paradise-cream/80 text-sm font-medium">Your rating</p>
        <StarRating rating={rating} onChange={setRating} />
      </div>

      <div className="space-y-1.5">
        <label className="block text-paradise-cream/80 text-sm font-medium">
          Comments{' '}
          <span className="text-paradise-cream/40 font-normal">(optional)</span>
        </label>
        <textarea
          rows={3}
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Share your thoughts about this Family Worship evening..."
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-paradise-cream placeholder:text-white/30 focus:outline-none focus:border-paradise-gold transition-colors text-sm resize-none"
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2.5">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={rating === 0 || submitting || loading}
        className="w-full bg-paradise-gold text-paradise-green-deep font-semibold rounded-xl py-2.5 hover:bg-paradise-gold-light transition-colors disabled:opacity-50 text-sm"
      >
        {submitting ? 'Submitting…' : editing ? 'Update Feedback' : 'Submit Feedback'}
      </button>

      {editing && (
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="w-full border border-paradise-cream/20 text-paradise-cream/60 rounded-xl py-2.5 hover:border-paradise-cream/40 transition-colors text-sm"
        >
          Cancel
        </button>
      )}
    </form>
  )
}

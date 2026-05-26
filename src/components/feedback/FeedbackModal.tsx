import { X, Loader2 } from 'lucide-react'
import { useFeedback } from '../../hooks/useFeedback'
import { useAuthContext } from '../../context/AuthContext'
import { FeedbackForm } from './FeedbackForm'
import { FeedbackSummary } from './FeedbackSummary'
import type { FamilyWorshipEvent } from '../../types'

interface FeedbackModalProps {
  event: FamilyWorshipEvent
  onClose: () => void
}

function formatEventDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function FeedbackModal({ event, onClose }: FeedbackModalProps) {
  const { profile } = useAuthContext()
  const isHH = profile?.role === 'head_of_household'
  const {
    feedback,
    averageRating,
    userFeedback,
    hasSubmitted,
    submitFeedback,
    memberCount,
    loading,
  } = useFeedback(event.id, event.household_id)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-paradise-green-deep/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg backdrop-blur-lg bg-paradise-green-deep/80 border border-white/20 rounded-3xl p-6 z-10 max-h-[90vh] overflow-y-auto space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-2xl text-paradise-cream">Family Worship Feedback</h2>
            <p className="text-paradise-cream/60 text-sm mt-0.5">
              {event.title || 'Family Worship Evening'} · {formatEventDate(event.scheduled_at)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-paradise-cream/50 hover:text-paradise-cream hover:bg-white/10 transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={28} className="text-paradise-gold animate-spin" />
          </div>
        ) : (
          <>
            {/* HH sees summary overview */}
            {isHH && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-paradise-cream/50 text-xs uppercase tracking-wide font-semibold mb-4">
                  Feedback Overview
                </p>
                <FeedbackSummary
                  feedback={feedback}
                  averageRating={averageRating}
                  memberCount={memberCount}
                />
              </div>
            )}

            {/* Both roles submit their own feedback */}
            <div>
              <p className="text-paradise-cream/50 text-xs uppercase tracking-wide font-semibold mb-3">
                Your Feedback
              </p>
              <FeedbackForm
                event={event}
                userFeedback={userFeedback}
                hasSubmitted={hasSubmitted}
                submitFeedback={submitFeedback}
                loading={loading}
              />
            </div>
          </>
        )}

        {/* Footer */}
        <div className="pt-1 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full border border-paradise-cream/20 text-paradise-cream/70 rounded-xl py-2.5 hover:border-paradise-cream/40 transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

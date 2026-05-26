import { StarRating } from './StarRating'
import type { FeedbackWithProfile } from '../../hooks/useFeedback'

interface FeedbackSummaryProps {
  feedback: FeedbackWithProfile[]
  averageRating: number
  memberCount: number
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(p => p[0] ?? '')
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function FeedbackSummary({ feedback, averageRating, memberCount }: FeedbackSummaryProps) {
  if (feedback.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-4 text-paradise-cream/30">
        <p className="text-sm">No feedback submitted yet</p>
      </div>
    )
  }

  const starCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: feedback.filter(f => f.rating === star).length,
  }))
  const maxCount = Math.max(...starCounts.map(s => s.count), 1)

  return (
    <div className="space-y-5">
      {/* Average + response count */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <span className="font-display text-4xl text-paradise-cream">
            {averageRating.toFixed(1)}
          </span>
          <StarRating rating={averageRating} readonly />
        </div>
        <p className="text-paradise-cream/50 text-sm">
          {feedback.length} of {memberCount} member{memberCount !== 1 ? 's' : ''} responded
        </p>
      </div>

      {/* Rating breakdown */}
      <div className="space-y-1.5">
        {starCounts.map(({ star, count }) => (
          <div key={star} className="flex items-center gap-2">
            <span className="text-paradise-cream/40 text-xs w-3 text-right">{star}</span>
            <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-paradise-gold transition-all duration-500"
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
            <span className="text-paradise-cream/40 text-xs w-3">{count}</span>
          </div>
        ))}
      </div>

      {/* Individual entries */}
      <div className="space-y-3">
        {feedback.map(entry => {
          const name = entry.profiles?.full_name ?? 'Member'
          return (
            <div
              key={entry.id}
              className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="w-8 h-8 rounded-full bg-paradise-green-mid flex items-center justify-center shrink-0">
                <span className="text-paradise-cream text-xs font-semibold">{getInitials(name)}</span>
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <StarRating rating={entry.rating} readonly />
                  <span className="text-paradise-cream/40 text-xs">{formatDate(entry.created_at)}</span>
                </div>
                {entry.comment && (
                  <p className="text-paradise-cream/70 text-sm leading-relaxed">{entry.comment}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

import { Star, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { AppShell } from '../../components/layout/AppShell'

export function FeedbackPage() {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)

  return (
    <AppShell>
      <div className="px-4 py-6 max-w-lg mx-auto space-y-5">
        <div>
          <h1 className="font-display text-3xl text-paradise-cream">Session Feedback</h1>
          <p className="text-paradise-cream/60 text-sm mt-1">How did your last worship night go?</p>
        </div>

        {/* Session reference */}
        <Card variant="glass">
          <p className="text-paradise-cream/50 text-xs uppercase tracking-wide mb-1">Last Session</p>
          <p className="text-paradise-cream font-semibold">Bible Study — Romans 12</p>
          <p className="text-paradise-cream/50 text-xs mt-0.5">April 28, 2026 · 45 minutes</p>
        </Card>

        {/* Rating */}
        <Card variant="glass" className="space-y-4">
          <div>
            <p className="text-paradise-cream font-medium mb-3">How would you rate this session?</p>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="transition-transform hover:scale-110 active:scale-95"
                >
                  <Star
                    size={36}
                    className={
                      star <= (hovered || rating)
                        ? 'text-paradise-gold fill-paradise-gold'
                        : 'text-paradise-cream/20'
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-paradise-cream/80 text-sm font-medium">
              <MessageSquare size={14} />
              Notes (optional)
            </label>
            <textarea
              rows={3}
              placeholder="What went well? What could be better?"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-paradise-cream placeholder-paradise-cream/30 focus:outline-none focus:border-paradise-gold/60 text-sm resize-none"
            />
          </div>

          <Button variant="primary" size="md" fullWidth disabled={rating === 0}>
            Submit Feedback
          </Button>
        </Card>

        {/* Past feedback */}
        <div>
          <h2 className="font-display text-xl text-paradise-cream mb-3">Past Feedback</h2>
          <Card variant="glass" className="text-paradise-cream/50 text-sm flex items-center gap-2">
            <Star size={16} className="text-paradise-gold/40" />
            Your past session ratings will appear here.
          </Card>
        </div>
      </div>
    </AppShell>
  )
}

import { useRef, useState } from 'react'
import { Check, X, ExternalLink } from 'lucide-react'
import type { Topic } from '../../types'

type SwipeState = 'idle' | 'swiping-right' | 'swiping-left' | 'accepted' | 'rejected'

interface TopicSwipeCardProps {
  topic: Topic
  onVote: (vote: 'yes' | 'no') => void
}

const MIN_SWIPE = 80

export function TopicSwipeCard({ topic, onVote }: TopicSwipeCardProps) {
  const [swipeState, setSwipeState] = useState<SwipeState>('idle')
  const [offsetX, setOffsetX] = useState(0)
  const startX = useRef<number | null>(null)
  const isDragging = useRef(false)

  function handleVote(vote: 'yes' | 'no') {
    setSwipeState(vote === 'yes' ? 'accepted' : 'rejected')
    setOffsetX(vote === 'yes' ? 300 : -300)
    setTimeout(() => {
      onVote(vote)
      setSwipeState('idle')
      setOffsetX(0)
    }, 500)
  }

  // Touch handlers
  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX
    isDragging.current = true
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!isDragging.current || startX.current === null) return
    const diff = e.touches[0].clientX - startX.current
    setOffsetX(diff)
    setSwipeState(diff > 0 ? 'swiping-right' : 'swiping-left')
  }

  function onTouchEnd() {
    isDragging.current = false
    if (offsetX > MIN_SWIPE) handleVote('yes')
    else if (offsetX < -MIN_SWIPE) handleVote('no')
    else { setOffsetX(0); setSwipeState('idle') }
    startX.current = null
  }

  // Mouse handlers for desktop
  function onMouseDown(e: React.MouseEvent) {
    startX.current = e.clientX
    isDragging.current = true
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current || startX.current === null) return
    const diff = e.clientX - startX.current
    setOffsetX(diff)
    setSwipeState(diff > 0 ? 'swiping-right' : 'swiping-left')
  }

  function onMouseUp() {
    if (!isDragging.current) return
    isDragging.current = false
    if (offsetX > MIN_SWIPE) handleVote('yes')
    else if (offsetX < -MIN_SWIPE) handleVote('no')
    else { setOffsetX(0); setSwipeState('idle') }
    startX.current = null
  }

  const rotation = offsetX * 0.08
  const yesOpacity = Math.min(offsetX / MIN_SWIPE, 1)
  const noOpacity = Math.min(-offsetX / MIN_SWIPE, 1)

  const isAnimating = swipeState === 'accepted' || swipeState === 'rejected'

  return (
    <div className="relative select-none">
      {/* Card */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{
          transform: `translateX(${offsetX}px) rotate(${rotation}deg)`,
          transition: isAnimating ? 'transform 0.5s ease' : 'none',
          cursor: isDragging.current ? 'grabbing' : 'grab',
        }}
        className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-6 space-y-4 relative overflow-hidden"
      >
        {/* Yes overlay */}
        {yesOpacity > 0 && (
          <div
            className="absolute inset-0 rounded-3xl flex items-center justify-center pointer-events-none"
            style={{
              background: `rgba(82,183,136,${yesOpacity * 0.4})`,
              border: `2px solid rgba(82,183,136,${yesOpacity})`,
              opacity: yesOpacity,
            }}
          >
            <span className="font-display text-2xl text-paradise-green-light">Interested! ✓</span>
          </div>
        )}

        {/* No overlay */}
        {noOpacity > 0 && (
          <div
            className="absolute inset-0 rounded-3xl flex items-center justify-center pointer-events-none"
            style={{
              background: `rgba(239,68,68,${noOpacity * 0.4})`,
              border: `2px solid rgba(239,68,68,${noOpacity})`,
              opacity: noOpacity,
            }}
          >
            <span className="font-display text-2xl text-red-400">Maybe later ✗</span>
          </div>
        )}

        <h2 className="font-display text-3xl text-paradise-cream leading-tight">{topic.title}</h2>

        {topic.description && (
          <p className="text-paradise-cream/70 text-base leading-relaxed">{topic.description}</p>
        )}

        {topic.source_url && (
          <a
            href={topic.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-paradise-gold text-sm hover:underline"
            onMouseDown={e => e.stopPropagation()}
          >
            View on JW.org <ExternalLink size={13} />
          </a>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-8 mt-5">
        <button
          onClick={() => handleVote('no')}
          className="w-14 h-14 rounded-full bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center text-red-400 hover:bg-red-500/30 hover:border-red-500 transition-colors"
          aria-label="Not interested"
        >
          <X size={24} />
        </button>
        <button
          onClick={() => handleVote('yes')}
          className="w-14 h-14 rounded-full bg-paradise-green-light/20 border-2 border-paradise-green-light/40 flex items-center justify-center text-paradise-green-light hover:bg-paradise-green-light/30 hover:border-paradise-green-light transition-colors"
          aria-label="Interested"
        >
          <Check size={24} />
        </button>
      </div>
    </div>
  )
}

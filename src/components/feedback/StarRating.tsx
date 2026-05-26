import { useState } from 'react'
import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  onChange?: (rating: number) => void
  readonly?: boolean
}

export function StarRating({ rating, onChange, readonly = false }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => {
          const filled = star <= (hovered || Math.round(rating))
          return (
            <button
              key={star}
              type="button"
              disabled={readonly}
              onClick={() => onChange?.(star)}
              onMouseEnter={() => { if (!readonly) setHovered(star) }}
              onMouseLeave={() => { if (!readonly) setHovered(0) }}
              className={[
                'transition-transform',
                readonly ? 'cursor-default' : 'hover:scale-110 active:scale-95',
              ].join(' ')}
            >
              <Star
                size={22}
                className={filled ? 'text-paradise-gold fill-paradise-gold' : 'text-paradise-cream/20'}
              />
            </button>
          )
        })}
      </div>
      {rating > 0 && (
        <span className="text-paradise-cream/60 text-sm tabular-nums">{rating.toFixed(1)}</span>
      )}
    </div>
  )
}

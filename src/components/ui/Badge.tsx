import { type HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'green' | 'mist' | 'sky'
}

const variantClasses = {
  gold: 'bg-paradise-gold/20 text-paradise-gold border border-paradise-gold/30',
  green: 'bg-paradise-green-mid/20 text-paradise-green-light border border-paradise-green-mid/30',
  mist: 'bg-paradise-green-mist text-paradise-green-deep border border-paradise-green-light/30',
  sky: 'bg-paradise-sky/20 text-paradise-ocean border border-paradise-sky/30',
}

export function Badge({ variant = 'mist', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variantClasses[variant], className].join(' ')}
      {...props}
    >
      {children}
    </span>
  )
}

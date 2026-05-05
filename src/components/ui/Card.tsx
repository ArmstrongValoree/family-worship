import { type HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'outline'
}

const variantClasses = {
  glass: 'bg-white/10 backdrop-blur-md border border-white/20 shadow-lg',
  solid: 'bg-paradise-cream border border-paradise-green-mist shadow-md',
  outline: 'bg-transparent border border-paradise-green-light',
}

export function Card({ variant = 'glass', className = '', children, ...props }: CardProps) {
  return (
    <div
      className={['rounded-2xl p-4', variantClasses[variant], className].join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}

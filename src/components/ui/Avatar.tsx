interface AvatarProps {
  src?: string
  name?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-xl',
}

function getInitials(name?: string) {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name ?? 'avatar'}
        className={['rounded-full object-cover border-2 border-paradise-gold/40', sizeClasses[size], className].join(' ')}
      />
    )
  }

  return (
    <div
      className={[
        'rounded-full flex items-center justify-center font-semibold bg-paradise-green-mid text-paradise-cream border-2 border-paradise-gold/40',
        sizeClasses[size],
        className,
      ].join(' ')}
    >
      {getInitials(name)}
    </div>
  )
}

import { Leaf } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { APP_NAME } from '../../lib/constants'

export function TopBar() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 h-16 backdrop-blur-md"
      style={{ background: 'rgba(26,61,43,0.85)' }}
    >
      <div className="flex items-center gap-2">
        <Leaf size={22} className="text-paradise-gold" />
        <span
          className="text-paradise-cream text-xl font-semibold tracking-wide"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          {APP_NAME}
        </span>
      </div>
      <Avatar size="sm" name="User" />
    </header>
  )
}

import { useState, useRef, useEffect } from 'react'
import { Leaf, Bell } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { APP_NAME } from '../../lib/constants'
import { useAuthContext } from '../../context/AuthContext'
import { useNotifications } from '../../hooks/useNotifications'

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function TopBar() {
  const { profile } = useAuthContext()
  const { notifications, unreadCount, markAsRead } = useNotifications(
    profile?.household_id,
    profile?.id
  )
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const recent = notifications.slice(0, 5)
  const bellLabel = unreadCount > 9 ? '9+' : unreadCount > 0 ? String(unreadCount) : null

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

      <div className="flex items-center gap-3" ref={panelRef}>
        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setOpen(o => !o)}
            className="relative p-2 rounded-xl text-paradise-cream/60 hover:text-paradise-cream hover:bg-white/10 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {bellLabel && (
              <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 rounded-full bg-paradise-gold text-paradise-green-deep text-[10px] font-bold flex items-center justify-center px-0.5 leading-none">
                {bellLabel}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-12 w-80 backdrop-blur-lg bg-paradise-green-deep/95 border border-white/20 rounded-2xl shadow-xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-white/10">
                <p className="text-paradise-cream font-semibold text-sm">Notifications</p>
              </div>
              {recent.length === 0 ? (
                <p className="px-4 py-6 text-paradise-cream/40 text-sm text-center">No notifications yet</p>
              ) : (
                <ul>
                  {recent.map(n => {
                    const isUnread = profile?.id ? !n.read_by.includes(profile.id) : false
                    return (
                      <li
                        key={n.id}
                        onClick={() => profile?.id && markAsRead(n.id, profile.id)}
                        className={[
                          'px-4 py-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors',
                          isUnread ? 'bg-paradise-gold/5' : '',
                        ].join(' ')}
                      >
                        <div className="flex items-start gap-2">
                          {isUnread && (
                            <span className="w-1.5 h-1.5 rounded-full bg-paradise-gold mt-1.5 shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-paradise-cream/80 text-xs leading-snug">{n.message}</p>
                            <p className="text-paradise-cream/30 text-[10px] mt-1">{timeAgo(n.created_at)}</p>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )}
        </div>

        <Avatar size="sm" name={profile?.full_name ?? 'User'} src={profile?.avatar_url} />
      </div>
    </header>
  )
}

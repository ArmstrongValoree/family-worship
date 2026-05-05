import { NavLink } from 'react-router-dom'
import { House, CalendarDays, BookOpen, Layers, User } from 'lucide-react'
import { ROUTES } from '../../lib/constants'

const navItems = [
  { to: ROUTES.HOME, icon: House, label: 'Home' },
  { to: ROUTES.CALENDAR, icon: CalendarDays, label: 'Calendar' },
  { to: ROUTES.STUDY, icon: BookOpen, label: 'Study' },
  { to: ROUTES.TOPICS, icon: Layers, label: 'Topics' },
  { to: ROUTES.PROFILE, icon: User, label: 'Profile' },
]

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around px-2 backdrop-blur-md"
      style={{ background: 'rgba(26,61,43,0.92)', height: '72px' }}
    >
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === ROUTES.HOME}
          className={({ isActive }) =>
            [
              'flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 relative',
              isActive
                ? 'text-paradise-gold'
                : 'text-paradise-cream/60 hover:text-paradise-cream',
            ].join(' ')
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium tracking-wide">{label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-paradise-gold rounded-full" />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

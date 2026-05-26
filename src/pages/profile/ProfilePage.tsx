import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../components/layout/AppShell'
import { Badge } from '../../components/ui/Badge'
import { NotificationSettings } from '../../components/notifications/NotificationSettings'
import { useAuthContext } from '../../context/AuthContext'
import { useHousehold } from '../../hooks/useHousehold'
import { ROUTES } from '../../lib/constants'

function getInitials(name: string): string {
  const parts = name.trim().split(' ').filter(Boolean)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function ProfilePage() {
  const { profile, signOut } = useAuthContext()
  const { household } = useHousehold(profile?.household_id)
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  const isHH = profile?.role === 'head_of_household'

  return (
    <AppShell>
      <div className="px-4 py-6 max-w-lg mx-auto space-y-5">
        <h1 className="font-display text-3xl text-paradise-cream">Profile</h1>

        {/* User card */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 flex flex-col items-center gap-3 text-center">
          <div className="w-20 h-20 rounded-full bg-paradise-green-deep border-2 border-paradise-gold/50 flex items-center justify-center">
            <span className="font-display text-3xl text-paradise-gold">
              {profile ? getInitials(profile.full_name) : '?'}
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl text-paradise-cream">
              {profile?.full_name ?? '—'}
            </h2>
            {isHH ? (
              <Badge variant="gold">Head of Household</Badge>
            ) : (
              <Badge variant="green">Family Member</Badge>
            )}
            {household && (
              <p className="text-paradise-cream/50 text-sm">{household.name}</p>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4">
          <p className="text-paradise-cream/50 text-xs uppercase tracking-wide font-semibold mb-3">
            Notifications
          </p>
          <NotificationSettings />
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 border border-paradise-cream/20 text-paradise-cream/70 hover:text-paradise-cream hover:border-paradise-cream/40 rounded-xl py-3 transition-colors font-medium"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </AppShell>
  )
}

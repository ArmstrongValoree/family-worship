import { Settings, LogOut, Users, Bell, Shield } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { AppShell } from '../../components/layout/AppShell'

const MENU_ITEMS = [
  { icon: Users, label: 'Household Members', desc: 'Manage your household', badge: '2' },
  { icon: Bell, label: 'Notifications', desc: 'Reminder settings' },
  { icon: Shield, label: 'Privacy & Security', desc: 'Manage account security' },
  { icon: Settings, label: 'App Settings', desc: 'Theme, language, and more' },
]

export function ProfilePage() {
  return (
    <AppShell>
      <div className="px-4 py-6 max-w-lg mx-auto space-y-5">
        <h1 className="font-display text-3xl text-paradise-cream">Profile</h1>

        {/* User card */}
        <Card variant="glass" className="flex items-center gap-4">
          <Avatar name="Family User" size="lg" />
          <div className="flex-1 min-w-0">
            <p className="text-paradise-cream font-semibold text-lg truncate">Family User</p>
            <p className="text-paradise-cream/50 text-sm truncate">user@example.com</p>
            <Badge variant="gold" className="mt-1">Household Admin</Badge>
          </div>
        </Card>

        {/* Household info */}
        <Card variant="glass">
          <p className="text-paradise-cream/50 text-xs uppercase tracking-wide mb-2">Your Household</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-paradise-cream font-semibold">The Smith Family</p>
              <p className="text-paradise-cream/50 text-xs mt-0.5">Invite code: <span className="font-mono tracking-widest text-paradise-gold">ABCD-1234</span></p>
            </div>
            <Badge variant="green">2 members</Badge>
          </div>
        </Card>

        {/* Menu */}
        <div className="space-y-2">
          {MENU_ITEMS.map(({ icon: Icon, label, desc, badge }) => (
            <button
              key={label}
              className="w-full text-left"
            >
              <Card variant="glass" className="flex items-center gap-3 hover:bg-white/20 transition-colors">
                <div className="p-2 rounded-xl bg-white/10">
                  <Icon size={18} className="text-paradise-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-paradise-cream text-sm font-semibold">{label}</p>
                  <p className="text-paradise-cream/50 text-xs">{desc}</p>
                </div>
                {badge && <Badge variant="green">{badge}</Badge>}
              </Card>
            </button>
          ))}
        </div>

        {/* Sign out */}
        <Button variant="ghost" size="md" fullWidth className="text-red-400 hover:text-red-300 border-red-400/20">
          <LogOut size={18} />
          Sign Out
        </Button>
      </div>
    </AppShell>
  )
}

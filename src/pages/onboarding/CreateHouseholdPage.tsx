import { Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { AppShell } from '../../components/layout/AppShell'
import { ROUTES } from '../../lib/constants'

export function CreateHouseholdPage() {
  return (
    <AppShell>
      <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
        <div className="flex flex-col items-center gap-2 pt-4 text-center">
          <Home size={36} className="text-paradise-gold" />
          <h1 className="font-display text-3xl text-paradise-cream">Create Household</h1>
          <p className="text-paradise-cream/60 text-sm">
            Set up your family's worship space. Others can join with an invite code.
          </p>
        </div>

        <Card variant="glass" className="space-y-4">
          <div className="space-y-1">
            <label className="block text-paradise-cream/80 text-sm font-medium">Household Name</label>
            <input
              type="text"
              placeholder="e.g. The Smith Family"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-paradise-cream placeholder-paradise-cream/30 focus:outline-none focus:border-paradise-gold/60 text-sm"
            />
          </div>
          <Button variant="primary" size="md" fullWidth>
            Create Household
          </Button>
        </Card>

        <p className="text-center text-paradise-cream/60 text-sm">
          Have a code?{' '}
          <Link to={ROUTES.JOIN} className="text-paradise-gold hover:underline">
            Join an existing household
          </Link>
        </p>
      </div>
    </AppShell>
  )
}

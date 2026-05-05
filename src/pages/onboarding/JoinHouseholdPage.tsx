import { KeyRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { ParadiseBackground } from '../../components/paradise/ParadiseBackground'
import { ROUTES } from '../../lib/constants'

export function JoinHouseholdPage() {
  return (
    <>
      <ParadiseBackground />
      <div className="min-h-dvh flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <KeyRound size={36} className="text-paradise-gold" />
            <h1 className="font-display text-3xl text-paradise-cream">Join a Household</h1>
            <p className="text-paradise-cream/60 text-sm">
              Enter the invite code your household admin shared with you.
            </p>
          </div>

          <Card variant="glass" className="space-y-4">
            <div className="space-y-1">
              <label className="block text-paradise-cream/80 text-sm font-medium">Invite Code</label>
              <input
                type="text"
                placeholder="e.g. ABCD-1234"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-paradise-cream placeholder-paradise-cream/30 focus:outline-none focus:border-paradise-gold/60 text-sm uppercase tracking-widest"
              />
            </div>
            <Button variant="primary" size="md" fullWidth>
              Join Household
            </Button>
          </Card>

          <p className="text-center text-paradise-cream/60 text-sm">
            No code?{' '}
            <Link to={ROUTES.CREATE_HOUSEHOLD} className="text-paradise-gold hover:underline">
              Create a household
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

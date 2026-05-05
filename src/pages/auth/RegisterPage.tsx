import { Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { ParadiseBackground } from '../../components/paradise/ParadiseBackground'
import { APP_NAME, ROUTES } from '../../lib/constants'

export function RegisterPage() {
  return (
    <>
      <ParadiseBackground />
      <div className="min-h-dvh flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="flex flex-col items-center gap-2 mb-2">
            <Leaf size={36} className="text-paradise-gold" />
            <h1 className="font-display text-4xl text-paradise-cream">{APP_NAME}</h1>
            <p className="text-paradise-cream/60 text-sm">Create your account</p>
          </div>

          <Card variant="glass" className="space-y-4">
            <div className="space-y-1">
              <label className="block text-paradise-cream/80 text-sm font-medium">Display Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-paradise-cream placeholder-paradise-cream/30 focus:outline-none focus:border-paradise-gold/60 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-paradise-cream/80 text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-paradise-cream placeholder-paradise-cream/30 focus:outline-none focus:border-paradise-gold/60 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-paradise-cream/80 text-sm font-medium">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-paradise-cream placeholder-paradise-cream/30 focus:outline-none focus:border-paradise-gold/60 text-sm"
              />
            </div>
            <Button variant="primary" size="md" fullWidth>
              Create Account
            </Button>
          </Card>

          <p className="text-center text-paradise-cream/60 text-sm">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="text-paradise-gold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

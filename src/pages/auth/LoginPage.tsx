import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf, Loader2 } from 'lucide-react'
import { useAuthContext } from '../../context/AuthContext'
import { ParadiseBackground } from '../../components/paradise/ParadiseBackground'
import { APP_NAME, ROUTES } from '../../lib/constants'

const inputClass =
  'w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-paradise-gold transition-colors'

export function LoginPage() {
  const { user, loading, signIn } = useAuthContext()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user) navigate(ROUTES.HOME, { replace: true })
  }, [user, loading, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await signIn(email, password)
      navigate(ROUTES.HOME, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <ParadiseBackground />
      <div className="min-h-dvh flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6">

          <div className="flex flex-col items-center gap-3">
            <Leaf size={44} className="text-paradise-gold" />
            <h1 className="font-display text-4xl text-paradise-cream">{APP_NAME}</h1>
            <p className="text-paradise-green-mist text-sm">Welcome back</p>
          </div>

          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-paradise-cream/80 text-sm font-medium">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-paradise-cream/80 text-sm font-medium">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2.5">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-paradise-gold text-paradise-green-deep font-semibold rounded-xl py-3 hover:bg-paradise-gold-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
              >
                {isSubmitting ? (
                  <><Loader2 size={18} className="animate-spin" /> Signing in…</>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-paradise-cream/60 text-sm">
            Don't have an account?{' '}
            <Link to={ROUTES.REGISTER} className="text-paradise-gold hover:underline">
              Register here
            </Link>
          </p>

        </div>
      </div>
    </>
  )
}

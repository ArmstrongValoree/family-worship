import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf, Crown, Users, Loader2 } from 'lucide-react'
import { useAuthContext } from '../../context/AuthContext'
import { ParadiseBackground } from '../../components/paradise/ParadiseBackground'
import { APP_NAME, ROUTES } from '../../lib/constants'
import type { UserRole } from '../../types'

const inputClass =
  'w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-paradise-gold transition-colors'

export function RegisterPage() {
  const { user, loading, signUp } = useAuthContext()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<UserRole>('family_member')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user) navigate(ROUTES.HOME, { replace: true })
  }, [user, loading, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setIsSubmitting(true)
    try {
      await signUp(email, password, fullName, role)
      navigate(
        role === 'head_of_household' ? ROUTES.CREATE_HOUSEHOLD : ROUTES.JOIN,
        { replace: true }
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <ParadiseBackground />
      <div className="min-h-dvh flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-6">

          <div className="flex flex-col items-center gap-3">
            <Leaf size={44} className="text-paradise-gold" />
            <h1 className="font-display text-4xl text-paradise-cream">{APP_NAME}</h1>
            <p className="text-paradise-green-mist text-sm">Create your account</p>
          </div>

          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-paradise-cream/80 text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>

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

              <div className="space-y-1.5">
                <label className="block text-paradise-cream/80 text-sm font-medium">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>

              {/* Role selector */}
              <div className="space-y-1.5">
                <label className="block text-paradise-cream/80 text-sm font-medium">Your Role</label>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    {
                      value: 'head_of_household' as UserRole,
                      icon: Crown,
                      label: 'Head of Household',
                      desc: 'I manage our family worship schedule',
                    },
                    {
                      value: 'family_member' as UserRole,
                      icon: Users,
                      label: 'Family Member',
                      desc: 'I participate in family worship',
                    },
                  ] as const).map(({ value, icon: Icon, label, desc }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRole(value)}
                      className={[
                        'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center',
                        role === value
                          ? 'border-paradise-gold bg-paradise-gold/20'
                          : 'border-white/20 bg-white/10 hover:bg-white/15',
                      ].join(' ')}
                    >
                      <Icon
                        size={24}
                        className={role === value ? 'text-paradise-gold' : 'text-paradise-cream/60'}
                      />
                      <span className="text-paradise-cream text-xs font-semibold leading-tight">{label}</span>
                      <span className="text-paradise-cream/50 text-[10px] leading-tight">{desc}</span>
                    </button>
                  ))}
                </div>
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
                  <><Loader2 size={18} className="animate-spin" /> Creating Account…</>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          </div>

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

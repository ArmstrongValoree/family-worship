import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { KeyRound, Loader2 } from 'lucide-react'
import { useAuthContext } from '../../context/AuthContext'
import { ParadiseBackground } from '../../components/paradise/ParadiseBackground'
import { supabase } from '../../lib/supabase'
import { ROUTES } from '../../lib/constants'

export function JoinHouseholdPage() {
  const { profile } = useAuthContext()
  const navigate = useNavigate()

  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!profile) return
    setError('')
    setIsSubmitting(true)

    try {
      const { data: household, error: findError } = await supabase
        .from('households')
        .select('id')
        .eq('invite_code', inviteCode.toLowerCase().trim())
        .single()

      if (findError || !household) {
        setError('Invite code not found. Please check and try again.')
        setIsSubmitting(false)
        return
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ household_id: household.id })
        .eq('id', profile.id)

      if (updateError) throw updateError

      navigate(ROUTES.HOME, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join household. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <ParadiseBackground />
      <div className="min-h-dvh flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6">

          <div className="flex flex-col items-center gap-3 text-center">
            <KeyRound size={44} className="text-paradise-gold" />
            <h1 className="font-display text-4xl text-paradise-cream">Join a Household</h1>
            <p className="text-paradise-green-mist text-sm">
              Enter the invite code shared by your Head of Household
            </p>
          </div>

          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-paradise-cream/80 text-sm font-medium">Invite Code</label>
                <input
                  type="text"
                  placeholder="e.g. ABCD-1234"
                  value={inviteCode}
                  onChange={e => setInviteCode(e.target.value.toUpperCase())}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-paradise-gold transition-colors uppercase tracking-widest"
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
                className="w-full bg-paradise-gold text-paradise-green-deep font-semibold rounded-xl py-3 hover:bg-paradise-gold-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <><Loader2 size={18} className="animate-spin" /> Joining…</>
                ) : (
                  'Join Household'
                )}
              </button>
            </form>
          </div>

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

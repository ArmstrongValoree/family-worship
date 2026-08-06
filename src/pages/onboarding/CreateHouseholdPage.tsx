import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Loader2 } from 'lucide-react'
import { useAuthContext } from '../../context/AuthContext'
import { ParadiseBackground } from '../../components/paradise/ParadiseBackground'
import { supabase } from '../../lib/supabase'
import { ROUTES } from '../../lib/constants'

export function CreateHouseholdPage() {
  const { user, profile } = useAuthContext()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user) return
    setError('')
    setIsSubmitting(true)

    try {
      // If the background profile fetch timed out (e.g. Supabase project was
      // waking up), try once more directly before giving up.
      let activeProfile = profile
      if (!activeProfile) {
        activeProfile = await Promise.race([
          Promise.resolve(
            supabase.from('profiles').select('*').eq('user_id', user.id).single()
          ).then(({ data }) => data ?? null).catch(() => null),
          new Promise<null>(resolve => setTimeout(() => resolve(null), 10000)),
        ])
      }

      if (!activeProfile) {
        setError(
          'Database unreachable — the profile fetch timed out. ' +
          'Open DevTools → Network tab and look for a pending request to supabase.co ' +
          'to diagnose the connection. Then refresh and try again.'
        )
        return
      }

      // Generate the UUID client-side — avoids needing to SELECT the row back
      // immediately (the SELECT policy requires profile.household_id to be set first).
      const householdId = crypto.randomUUID()

      // created_by references profiles.id (FK constraint), not auth.users.
      const { error: insertError } = await supabase
        .from('households')
        .insert({ id: householdId, name: name.trim(), created_by: activeProfile.id })

      let finalHouseholdId = householdId

      if (insertError) {
        // 23505 = unique_violation: INSERT succeeded on a prior attempt but SELECT was
        // blocked by RLS, so the response looked like an error. Recovery: find the row.
        if (insertError.code !== '23505') throw insertError

        if (activeProfile.household_id) {
          navigate(ROUTES.HOME, { replace: true })
          return
        }

        const existing = await Promise.race([
          Promise.resolve(
            supabase.from('households').select('id').eq('created_by', activeProfile.id).single()
          ).then(({ data }) => data ?? null).catch(() => null),
          new Promise<null>(resolve => setTimeout(() => resolve(null), 10000)),
        ])

        if (!existing) throw new Error('Household exists but could not be loaded. Ensure the SELECT policy allows created_by lookup, then refresh.')
        finalHouseholdId = existing.id
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ household_id: finalHouseholdId })
        .eq('id', activeProfile.id)

      if (updateError) throw updateError

      navigate(ROUTES.HOME, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create household. Please try again.')
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
            <Home size={44} className="text-paradise-gold" />
            <h1 className="font-display text-4xl text-paradise-cream">Create Your Household</h1>
            <p className="text-paradise-green-mist text-sm">Set up your family worship space</p>
          </div>

          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-paradise-cream/80 text-sm font-medium">Household Name</label>
                <input
                  type="text"
                  placeholder="e.g. The Johnson Family"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-paradise-gold transition-colors"
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
                  <><Loader2 size={18} className="animate-spin" /> Creating…</>
                ) : (
                  'Create Household'
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </>
  )
}

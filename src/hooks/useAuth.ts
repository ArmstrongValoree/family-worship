import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Profile, UserRole } from '../types'

interface AuthHook {
  user: User | null
  profile: Profile | null
  loading: boolean
  signUp: (email: string, password: string, full_name: string, role: UserRole) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

// Race the DB query against an 8-second timeout so a paused Supabase project
// never hangs the app indefinitely.
async function fetchProfile(userId: string): Promise<Profile | null> {
  let timeoutId: ReturnType<typeof setTimeout>

  const queryPromise = Promise.resolve(
    supabase.from('profiles').select('*').eq('user_id', userId).single()
  )
    .then(({ data, error }) => {
      clearTimeout(timeoutId)
      if (error || !data) return null
      return data as Profile
    })
    .catch(() => {
      clearTimeout(timeoutId)
      return null
    })

  const timeoutPromise = new Promise<null>(resolve => {
    timeoutId = setTimeout(() => resolve(null), 8000)
  })

  return Promise.race([queryPromise, timeoutPromise])
}

export function useAuth(): AuthHook {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Hard fallback: unblock the UI after 5s no matter what.
    const timeoutId = setTimeout(() => {
      if (mounted) setLoading(false)
    }, 5000)

    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        if (!mounted) return
        setUser(session?.user ?? null)
        // Unblock the UI as soon as auth state is known, before profile fetch.
        clearTimeout(timeoutId)
        setLoading(false)
        if (session?.user) {
          const p = await fetchProfile(session.user.id)
          if (mounted) setProfile(p)
        }
      })
      .catch(() => {
        if (mounted) {
          clearTimeout(timeoutId)
          setLoading(false)
        }
      })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return
        setUser(session?.user ?? null)
        // Unblock before profile fetch so the spinner clears on session change too.
        clearTimeout(timeoutId)
        setLoading(false)
        if (session?.user) {
          const p = await fetchProfile(session.user.id)
          if (mounted) setProfile(p)
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      mounted = false
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [])

  async function signUp(email: string, password: string, full_name: string, role: UserRole) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name, role } },
    })
    if (error) throw error
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return { user, profile, loading, signUp, signIn, signOut }
}

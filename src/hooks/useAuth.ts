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

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error || !data) return null
  return data as Profile
}

export function useAuth(): AuthHook {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Fallback: if auth resolution hangs (network timeout, DB unresponsive),
    // unblock the UI after 3 seconds rather than spinning forever.
    const timeoutId = setTimeout(() => {
      if (mounted) setLoading(false)
    }, 3000)

    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        if (!mounted) return
        setUser(session?.user ?? null)
        if (session?.user) {
          setProfile(await fetchProfile(session.user.id))
        }
        clearTimeout(timeoutId)
        setLoading(false)
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
        if (session?.user) {
          setProfile(await fetchProfile(session.user.id))
        } else {
          setProfile(null)
        }
        clearTimeout(timeoutId)
        setLoading(false)
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

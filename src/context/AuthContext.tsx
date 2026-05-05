import { createContext, useContext, type ReactNode } from 'react'
import { Leaf } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { useAuth } from '../hooks/useAuth'
import { ParadiseBackground } from '../components/paradise/ParadiseBackground'
import { APP_NAME } from '../lib/constants'
import type { Profile, UserRole } from '../types'

interface AuthContextValue {
  user: User | null
  profile: Profile | null
  loading: boolean
  signUp: (email: string, password: string, full_name: string, role: UserRole) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()

  if (auth.loading) {
    return (
      <>
        <ParadiseBackground />
        <div className="min-h-dvh flex flex-col items-center justify-center gap-4">
          <Leaf size={48} className="text-paradise-gold animate-spin-slow" />
          <p className="font-display text-3xl text-paradise-cream">{APP_NAME}</p>
        </div>
      </>
    )
  }

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}

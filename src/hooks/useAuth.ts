import { useState } from 'react'
import type { AuthState } from '../types'

export function useAuth(): AuthState {
  const [isLoading] = useState(false)

  // Placeholder — real auth logic connects to Supabase in a later phase
  return {
    user: null,
    isLoading,
    isAuthenticated: false,
  }
}
